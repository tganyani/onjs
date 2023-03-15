import express from "express";
import passport from "passport"

const recruiterRouter = express.Router();

import {
  createRecruiter,
  getRecruiterById,
  getRecruiterByEmail,
  deleteRecruiterById,
  getAllRecruiters,
  recruiterLogin,
  updateRecruiterAbout,
  updateRecruiterContacts,
  updateRecruiterAddress,
  recruiterImageUpload,
} from "../controllers/recruiter/recruiter.controllers.js";

import {uploadRecruiterProfile} from "../middleware/recruiter.file.upload.middleware.js"

recruiterRouter
  .get("/recruiters",passport.authenticate('jwt',{session:false}), getAllRecruiters)
  .get("/recruiters/:id", getRecruiterById)
  .post("/recruiters/email",getRecruiterByEmail)
  .post("/recruiters", createRecruiter)
  .post("/recruiters/login",recruiterLogin)
  .delete("/recruiters/:id",passport.authenticate('jwt',{session:false}),deleteRecruiterById)
  // updates
  .patch("/recruiters/about/:id",updateRecruiterAbout)
  .patch("/recruiters/contacts/:id",updateRecruiterContacts)
  .patch("/recruiters/address/:id",updateRecruiterAddress)
  // profile Image
  .patch("/recruiters/image/:id",uploadRecruiterProfile.single('image'),recruiterImageUpload)
export default recruiterRouter;



