import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import {unlink} from "fs/promises"

export const getAllCandidates = async (req, res) => {
  try {
    console.log(req.query)
    const candidates = await prisma.candidate.findMany({
      where:{
        OR:[
          {
            position:{
              contains: req.query.position,
              mode: 'insensitive',
            }
          },
          {
            country:{
              contains: req.query.country,
              mode: 'insensitive',
            }
          },
          {
            city:{
              contains: req.query.city,
              mode: 'insensitive',
            }
          }
        ]
      }
    })
    res.json(candidates);
  } catch (error) {
    console.error(error);
  }
};

export const getCandidateById = async (req, res) => {
  try {
    res.json(
      await prisma.candidate.findUnique({
        where: {
          id: Number(req.params.id),
        },
        select:{
          country:true,
          about:true,
          firstName:true,
          lastName:true,
          email:true,
          image:true,
          position:true,
          city: true,
          education:{
            select:{
              schoolName:true,
              startDate:true,
              endDate:true,
              id:true
            }
          },
          projects:true,
          contacts:{
            select:{
              id:true,
              email:true,
              phone:true
            }
          },
          previousPosition:{
            select:{
              position:true,
              companyName:true,
              startDate:true,
              endDate:true,
              id:true
            }
          },
          skills:{
            select:{
              id:true,
              title :true,
              experience:true
            }
          },
          proposed:{
            select:{
              proposedJobs:{
                select:{
                  id:true
                }
              }
            }
          },
          telegram:{
            select:{
              chatId:true,
              firstName:true
            }
          }
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const createCandidate = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const created = await prisma.candidate.create({
      data: {
        ...req.body,
        password,
      },
    });
    if(created){
      res.json({
        message: "user successfully created",
        account:true
      });
    }
    else{
      res.json({
        message: "error occured",
        account:false
      });
    }
   
  } catch (error) {
    console.error(error);
  }
};

export const deleteCandidateById = async (req, res) => {
  try {
    await prisma.candidate.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      message: "user successfully deleted",
    });
  } catch (error) {
    console.error(error);
  }
};
export const getCandidateByEmail = async (req, res) => {
  try {
   const candidate =  await prisma.candidate.findUnique({
        where: {
          email: req.body.email,
        },
      })
      if(candidate){
        res.json({
          found:true
        })
      }
      else{
        res.json({
          found:false
        })
      }
  } catch (error) {
    console.error(error);
  }
};

export const candidateLogin = async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (candidate) {
      const result = await bcrypt.compare(
        req.body.password,
        candidate.password
      );
      if (result) {
        res.json({
          id: candidate.id,
          email: candidate.email,
          logged:true,
          position:candidate.position          ,
          access_token: jsonwebtoken.sign(
            {
              data: {
                id:candidate.id
              },
            },
            "my-secret",
            { expiresIn: "1h" }
          ),
        });
      }
      else{
        res.json({
          logged:false,
          message:"wrong credentials"
        })
      }
    } else {
      res.json({
        logged:false,
        message:"account does not exist ! sign first"
      })
    }
  } catch (error) {
    console.error(error);
  }
};

// profile image update
export const imageUpload = async (req, res)=>{
  try {
    await prisma.candidate.update({
      where:{
        id:Number(req.params.id)
      },
      data:{
        image: req.file.filename
      }
    })
    if(req.body.prevPath){
      await unlink(`./public/${req.body.prevPath}`)
    }
    res.json({
      message:"done"
    })
  } catch (error) {
    console.log(error)
  }
}

// update name and about
export const updateProfile = async (req, res)=>{
  try {
    await prisma.candidate.update({
      where:{
        id:Number(req.params.id)
      },
      data:{
        country: req.body.country,
        city:req.body.city,
        position: req.body.position
      },
    })
    res.json({
      message:"done"
    })
  } catch (error) {
    console.log(error)
  }
}

export const updateAbout = async (req, res)=>{
  try {
    await prisma.candidate.update({
      where:{
        id:Number(req.params.id)
      },
      data:{
        about: req.body.about,
      },
    })
    res.json({
      message:"done"
    })
  } catch (error) {
    console.log(error)
  }
}

