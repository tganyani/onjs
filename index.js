import express from "express";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import prisma from "./lib/prisma.js";
import path from "path";

import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import candidateRouter from "./routes/candidate.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import vaccancyRouter from "./routes/vaccancy.routes.js";

import { candidateStrategy } from "./middleware/candidate.auth.middleware.js";
import { recruiterStrategy } from "./middleware/recruiter.auth.middleware.js";
passport.use(recruiterStrategy);
passport.use(candidateStrategy);

const app = express();
const httpServer = createServer(app);

// telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(candidateRouter);
app.use(recruiterRouter);
app.use(vaccancyRouter);
app.use(passport.initialize());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("createRoom", async (data) => {
    try {
      const foundRoom = await prisma.room.findUnique({
        where: {
          name: data.name,
        },
      });
      if (foundRoom) {
        await prisma.chat.create({
          data: {
            roomId: foundRoom.id,
            message: data.message,
            accountType: data.accountType,
          },
        });
      } else {
        const create = await prisma.room.create({
          data: {
            name: data.name,
            candidateId: data.candidateId,
            recruiterId: data.recruiterId,
          },
        });
        if (create) {
          await prisma.chat.create({
            data: {
              roomId: create.id,
              message: data.message,
              accountType: data.accountType,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("joinRoom", (data) => {
    socket.join(data.roomName);
  });
  socket.on("newMsg", async (data) => {
    const created = await prisma.chat.create({
      data: {
        roomId: Number(data.roomId),
        message: data.message,
        accountType: data.accountType,
      },
    });
    if (created) {
      socket.join(data.roomName);
      io.to(data.roomName).emit("roomMsg", new Date());
      await prisma.room.update({
        where:{
          id:Number(data.roomId)
        },
        data:{
          dateUpdated: new Date() // to update the room on new message so that we can oreder them properly
        }
      })
    }
  });
  socket.on("read", async (data) => {
    const updated = await prisma.room.update({
      where: {
        id: Number(data.roomId),
      },
      data: {
        chats: {
          updateMany: {
            where: {
              read: false,
              NOT: {
                accountType: data.accountType,
              },
            },
            data: {
              read: true,
            },
          },
        },
      },
    });
    if (updated) {
      socket.join(data.roomName);
      io.to(data.roomName).emit("refreshRead", new Date());
    }
  });
  socket.on("online", async (data) => {
    if (data.accountType === "candidate") {
      const updated = await prisma.candidate.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: true,
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
    if (data.accountType === "recruiter") {
      const updated = await prisma.recruiter.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: true,
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
  });
  socket.on("offline", async (data) => {
    if (data.accountType === "candidate") {
      const updated = await prisma.candidate.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: false,
          lastSeen: new Date(),
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
    if (data.accountType === "recruiter") {
      const updated = await prisma.recruiter.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: false,
          lastSeen: new Date(),
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
  });
  socket.on("typing", (data) => {
    socket.join(data.roomName);
    socket.to(data.roomName).emit("typingUser", new Date());
  });
  socket.on("newJob", (data) => {
    io.emit("refreshJobs", new Date());
  });
  socket.on("newJobUpdate", (data) => {
    io.emit("refreshUpdateJob", new Date());
  });
  // telegram bot subsribe
  socket.on("sendInvitationMsg",async (data)=>{
    if(data.chatId){
      await bot.telegram.sendMessage(data.chatId,`You have recieved initation from ${data.companyName}.Start conversation https://www.ritchieng.com/machine-learning-resources/ . With respect ${data.fName} ${data.lName} `)
    }
  })
  socket.on("sendRefusalMsg",async (data)=>{
    if(data.chatId){
      await bot.telegram.sendMessage(data.chatId,`For now we are not ready to invite you at ${data.companyName}, but this should not stop you from applying when we post new vaccancies .Start conversation https://www.ritchieng.com/machine-learning-resources/ . With respect ${data.fName} ${data.lName} `)
    }
  })
  socket.on("sendCandidateProposal",async(data)=>{
    if(data.chatId){
      await bot.telegram.sendMessage(data.chatId,`Hello ${data.firstName} you have received a job proposal`)
    }
  })
});

bot.start(async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Welcome ${ctx.message.chat.first_name} to our telegram bot. This bot help you to browse for jobs. We kindly advise you to link it with your Imisebenzi account `,
    {
      reply_markup: {
        inline_keyboard: [ 
          [{ text: 'Link your Imisebenzi account', callback_data: 'link_account' }],
          ]
          ,
      // force_reply:true,
      // input_field_placeholder:"Enter your Email to link your account"
    }
    
    
  }
  );

  // console.log(ctx.message.chat);
});

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  // await ctx.telegram.answerCbQuery(ctx.callbackQuery.id, "Thank you");
  await ctx.telegram.sendMessage(ctx.callbackQuery.from.id, "Enter_your_email_which_you_use_to_log_to_Imisebenzi_account",{
    reply_markup: {
    force_reply:true,
    input_field_placeholder:"Enter your Email to link your account"
  }
  
  
})
  // console.log(ctx.callbackQuery)

});

bot.on(message("text"), async (ctx) => {
  // Explicit usage
  // console.log(ctx.message);
  // Using context shortcut
  if(ctx.message.reply_to_message?.text==="Enter_your_email_which_you_use_to_log_to_Imisebenzi_account"){
    const user = await prisma.candidate.findUnique({
      where:{
        email:ctx.message.text
      }
    })
    if(user){
      const subsriber = await prisma.telegram.create({
        data:{
          chatId: ctx.message.chat.id,
          firstName: ctx.message.chat.first_name,
          candidateId:user.id
        }
      })
      if(subsriber){
        await ctx.reply(`Thank you ${ctx.message.chat.first_name} for linking your Imisebenzi account`);
      }
      else{
        await ctx.reply(`We were unable to link your account`);
      }
    }
    else{
      await ctx.reply(`We were unable to find  your Imisebenzi account`);
    }
    
  }
  else{
    await ctx.reply(`Hello ${ctx.message.text}`);
  }
  console.log(ctx.message)
});

bot.launch();

const port = process.env.PORT || 5000;

httpServer.listen(port, () =>
  console.log(`The server is up running on port ${port}`)
);
