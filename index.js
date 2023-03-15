import express from "express";
import passport from "passport"
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors'
import prisma from "./lib/prisma.js";
import path from "path";

import candidateRouter from "./routes/candidate.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import vaccancyRouter from "./routes/vaccancy,routes.js";

import { candidateStrategy } from "./middleware/candidate.auth.middleware.js";
import { recruiterStrategy } from "./middleware/recruiter.auth.middleware.js";
passport.use(candidateStrategy)
passport.use(recruiterStrategy)

const app = express()
const httpServer = createServer(app)

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(candidateRouter)
app.use(recruiterRouter)
app.use(vaccancyRouter)
app.use(passport.initialize())

const io = new Server(httpServer,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

  io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("createRoom",async (data)=>{
      try {
        const foundRoom = await prisma.room.findUnique({
          where:{
            name:data.name
          }
        })
        if(foundRoom){
          await prisma.chat.create({
           data:{
            roomId:foundRoom.id,
            message:data.message,
            accountType:data.accountType
           }
          })
        }
        else{
          const create = await prisma.room.create({
            data:{
              name:data.name,
              candidateId:data.candidateId,
              recruiterId:data.recruiterId
            }
          })
          if(create){
            await prisma.chat.create({
              data:{
                roomId:create.id,
                message:data.message,
                accountType:data.accountType
              }
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    })
    socket.on("joinRoom",(data)=>{
      socket.join(data.roomName)
    })
    socket.on("newMsg",async (data)=>{
      const created = await prisma.chat.create({
        data:{
          roomId:Number(data.roomId),
          message:data.message,
          accountType:data.accountType
        }
      })
      if(created){
      socket.join(data.roomName)
      io.to(data.roomName).emit("roomMsg",new Date())
      }
    })
    socket.on("read",async (data)=>{
      const updated =  await prisma.room.update({
        where:{
          id:Number(data.roomId)
        },
        data:{
          chats:{
            updateMany:{
              where:{
                read:false,
                NOT: {
                  accountType:data.accountType
                },
              },
              data:{
                read:true
              }
            }
          }
         }
        
      })
      if(updated){
        socket.join(data.roomName)
      io.to(data.roomName).emit("refreshRead",new Date())
      }
    })
    socket.on("online",async (data)=>{
      if(data.accountType==="candidate"){
        const updated = await prisma.candidate.update({
          where:{
            id:Number(data.id)
          },
          data:{
            online:true
          }
        })
        if(updated){
          io.emit("onlineUser",new Date())
        }
      }
      if(data.accountType==="recruiter"){
        const updated = await prisma.recruiter.update({
          where:{
            id:Number(data.id)
          },
          data:{
            online:true
          }
        })
        if(updated){
          io.emit("onlineUser",new Date())
        }
      }
    })
    socket.on("offline",async (data)=>{
      if(data.accountType==="candidate"){
        const updated = await prisma.candidate.update({
          where:{
            id:Number(data.id)
          },
          data:{
            online:false,
            lastSeen:new Date(),
          }
        })
        if(updated){
          io.emit("onlineUser",new Date())
        }
      }
      if(data.accountType==="recruiter"){
        const updated = await prisma.recruiter.update({
          where:{
            id:Number(data.id)
          },
          data:{
            online:false,
            lastSeen:new Date(),
          }
        })
        if(updated){
          io.emit("onlineUser",new Date())
        }
      }
    })
    socket.on("typing",(data)=>{
      socket.join(data.roomName)
      socket.to(data.roomName).emit("typingUser",new Date())
    })
    socket.on("newJob",(data)=>{
      io.emit("refreshJobs",new Date())
    })
  });

const port = process.env.PORT || 5000

httpServer.listen(port,()=>console.log(`The server is up running on port ${port}`));

