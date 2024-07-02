import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { unlink } from "fs/promises";
import { decode } from "punycode";
import { message } from "telegraf/filters";
import { read } from "fs";


export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        OR: [
          {
            position: {
              contains: req.query.position,
              mode: "insensitive",
            },
          },
          {
            country: {
              contains: req.query.country,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: req.query.city,
              mode: "insensitive",
            },
          },
        ],
      },
    });
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
        select: {
          country: true,
          about: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          position: true,
          city: true,
          education: {
            select: {
              schoolName: true,
              startDate: true,
              endDate: true,
              id: true,
            },
          },
          projects: true,
          contacts: {
            select: {
              id: true,
              email: true,
              phone: true,
            },
          },
          previousPosition: {
            select: {
              position: true,
              companyName: true,
              startDate: true,
              endDate: true,
              id: true,
            },
          },
          skills: {
            select: {
              id: true,
              title: true,
              experience: true,
            },
          },
          proposed: {
            select: {
              proposedJobs: {
                select: {
                  id: true,
                },
              },
            },
          },
          telegram: {
            select: {
              chatId: true,
              firstName: true,
            },
          },
        },
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
    if (created) {
      res.json({
        message: "user successfully created",
        account: true,
        userId:created.id,
      });
    } else {
      res.json({
        message: "error occured",
        account: false,
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
    const candidate = await prisma.candidate.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (candidate) {
      res.json({
        found: true,
      });
    } else {
      res.json({
        found: false,
      });
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
          logged: true,
          position: candidate.position,
          city:candidate.city,
          country:candidate.country,
          firstName:candidate.firstName,
          lastName:candidate.lastName,
          access_token: jsonwebtoken.sign(
            {
              data: {
                id: candidate.id,
                accountType:"candidate"
              },
            },
            "my-secret",
            { expiresIn: "1h" }
          ),
          refresh_token: jsonwebtoken.sign(
            {
              data: {
                id: candidate.id,
              },
            },
            "my-secret",
            { expiresIn: "1h" }
          ),
        });
      } else {
        res.json({
          logged: false,
          message: "wrong credentials",
        });
      }
    } else {
      res.json({
        logged: false,
        message: "account does not exist ! sign first",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// refresh token
export const refreshCandidateToken = async (req, res) => {
  try {
    await jsonwebtoken.verify(req.body.refresh_token, "my-secret",(err,decoded)=>{
      if(decoded?.data?.id){
      res.json(
        {
          "valid_access_token":true,
          access_token: jsonwebtoken.sign(
            {
              data: {
                id: decoded?.data?.id,
                accountType:"candidate"
              },
            },
            "my-secret",
            { expiresIn: "1m"  }
          ),
        }
      )
      }
      else{
        res.json({
          "valid_access_token":false
        })
      }
    })
    // res.json({
    //   message:"wrong passport"
    // })
  } catch (err) {
    console.log(err)

    res.json({
      error: true,
    });
  }
};

// profile image update
export const imageUpload = async (req, res) => {
  try {
    await prisma.candidate.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        image: req.file.filename,
      },
    });
    if (req.body.prevPath!== 'null') {
      await unlink(`./public/${req.body.prevPath}`);
    }
    res.json({
      message: "done",
    });
  } catch (error) {
    console.log(error);
  }
};
// profile image delete
export const deleteCandidateProfileImage = async (req, res) => {
  try {
    await prisma.candidate.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        image: null,
      },
    });
    if (req.body.prevPath) {
      await unlink(`./public/${req.body.prevPath}`);
    }
    res.json({
      message: "done",
    });
  } catch (error) {
    console.log(error);
  }
};


// update name and about
export const updateProfile = async (req, res) => {
  try {
    await prisma.candidate.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        country: req.body.country,
        city: req.body.city,
        position: req.body.position,
      },
    });
    res.json({
      message: "done",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateAbout = async (req, res) => {
  try {
    await prisma.candidate.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        about: req.body.about,
      },
    });
    res.json({
      message: "done",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCandidateLetter = async (req, res) => {
  try {
    
    res.json(await prisma.candidate.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select:{
        letter:true
      }
    }));
  } catch (error) {
    console.log(error);
  }
};

export const getCandidateNotifications = async (req, res) => {
  try {
    
    res.json(await prisma.candidate.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select:{
        
        notifications:{
          orderBy: {
            id: 'desc',
          },
        }
      }
    }));
  } catch (error) {
    console.log(error);
    res.json({
      message:"error"
    })
  }
};

// update candidate notification by notification id
export const updateReadCandidateNotifications = async (req, res) => {
  try {
    
    res.json(await prisma.notification.update({
      where: {
        id: Number(req.params.id),
      },
      data:{
        read:true
      }
    }));
  } catch (error) {
    console.log(error);
    res.json({
      message:"error"
    })
  }
};

