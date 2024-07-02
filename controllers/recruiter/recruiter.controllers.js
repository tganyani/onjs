import { unlink } from "fs/promises";
import prisma from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const getAllRecruiters = async (req, res) => {
  try {
    res.json(await prisma.recruiter.findMany());
  } catch (error) {
    console.error(error);
  }
};

export const getRecruiterById = async (req, res) => {
  try {
    res.json(
      await prisma.recruiter.findUnique({
        where: {
          id: Number(req.params.id),
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const getRecruiterByEmail = async (req, res) => {
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (recruiter) {
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

export const createRecruiter = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const created = await prisma.recruiter.create({
      data: {
        ...req.body,
        password,
      },
    });
    if (created) {
      res.json({
        message: "recruiter successfully created",
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

export const deleteRecruiterById = async (req, res) => {
  try {
    await prisma.recruiter.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      message: "recruiter successfully deleted",
    });
  } catch (error) {
    console.error(error);
  }
};

export const recruiterLogin = async (req, res) => {
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (recruiter) {
      const result = await bcrypt.compare(
        req.body.password,
        recruiter.password
      );
      if (result) {
        res.json({
          id: recruiter.id,
          logged: true,
          email: recruiter.email,
          position: "",
          country: "",
          city: "",
          firstName: recruiter.firstName,
          lastName: recruiter.lastName,
          access_token: jsonwebtoken.sign(
            {
              data: {
                id: recruiter.id,
                accountType: "recruiter",
              },
            },
            "my-secret",
            { expiresIn: "1h" }
          ),
          refresh_token: jsonwebtoken.sign(
            {
              data: {
                id: recruiter.id,
              },
            },
            "my-secret",
            { expiresIn: "1h" }
          ),
        });
      } else {
        res.json({
          message: "wrong credentials",
          logged: false,
        });
      }
    } else {
      res.json({
        message: "acount does not exist! signin first",
        logged: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
// refresh token
export const refreshRecruiterToken = async (req, res) => {
  try {
    await jsonwebtoken.verify(
      req.body.refresh_token,
      "my-secret",
      (err, decoded) => {
        if (decoded?.data?.id) {
          res.json({
            valid_access_token: true,
            access_token: jsonwebtoken.sign(
              {
                data: {
                  id: decoded?.data?.id,
                  accountType: "recruiter",
                },
              },
              "my-secret",
              { expiresIn: "1m" }
            ),
          });
        } else {
          res.json({
            valid_access_token: false,
          });
        }
      }
    );
    // res.json({
    //   message:"wrong passport"
    // })
  } catch (err) {
    console.log(err);

    res.json({
      error: true,
    });
  }
};
export const updateRecruiterAbout = async (req, res) => {
  try {
    await prisma.recruiter.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        about: req.body.about,
      },
    });
    res.json({
      message: "recruiter successfully updated",
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateRecruiterContacts = async (req, res) => {
  try {
    await prisma.recruiter.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        telegram: req.body.telegram,
        phone: req.body.phone,
        linkedIn: req.body.linkedIn,
        website: req.body.website,
      },
    });
    res.json({
      message: "recruiter successfully updated",
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateRecruiterAddress = async (req, res) => {
  try {
    await prisma.recruiter.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        country: req.body.country,
        city: req.body.city,
        street: req.body.street,
      },
    });
    res.json({
      message: "recruiter successfully updated",
    });
  } catch (error) {
    console.error(error);
  }
};

export const recruiterImageUpload = async (req, res) => {
  try {
    await prisma.recruiter.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        image: req.file.filename,
      },
    });
    if (req.body.prevPath !== "null") {
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
export const deleteRecruiterProfileImage = async (req, res) => {
  try {
    await prisma.recruiter.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        image: null,
      },
    });
    if (req.body.prevPath !== "null") {
      await unlink(`./public/${req.body.prevPath}`);
    }
    res.json({
      message: "done",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateRecruiterName = async (req, res) => {
  try {
    await prisma.recruiter.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        companyName: req.body?.companyName,
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
      },
    });
    res.json({
      message: "recruiter successfully updated",
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "error will updating ",
    });
  }
};

// Recruiter notifications
export const getRecruiterNotifications = async (req, res) => {
  try {
    res.json(
      await prisma.recruiter.findUnique({
        where: {
          id: Number(req.params.id),
        },
        select: {
          notifications: {
            orderBy: {
              id: "desc",
            },
          },
        },
      })
    );
  } catch (error) {
    console.log(error);
    res.json({
      message: "error",
    });
  }
};

// update candidate notification by notification id
export const updateReadRecruiterNotifications = async (req, res) => {
  try {
    res.json(
      await prisma.recruiterNotification.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          read: true,
        },
      })
    );
  } catch (error) {
    console.log(error);
    res.json({
      message: "error",
    });
  }
};
