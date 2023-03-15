import {unlink} from "fs/promises"
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
          access_token: jsonwebtoken.sign(
            {
              data: {
                id: recruiter.id,
              },
            },
            "my-secret2",
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


