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
  refreshRecruiterToken,
  updateRecruiterName,
  deleteRecruiterProfileImage,
  getRecruiterNotifications,
  updateReadRecruiterNotifications,
} from "../controllers/recruiter/recruiter.controllers.js";

import {uploadRecruiterProfile} from "../middleware/recruiter.file.upload.middleware.js"

recruiterRouter
  .get("/recruiters",passport.authenticate('recruiterStrategy',{session:false}), getAllRecruiters)
  .get("/recruiters/:id", getRecruiterById)
  .post("/recruiters/email",getRecruiterByEmail)
  .post("/recruiters", createRecruiter)
  .post("/recruiters/login",recruiterLogin)
  // refresh token
  .post("/recruiters/refresh", refreshRecruiterToken)
  .delete("/recruiters/:id",passport.authenticate('recruiterStrategy',{session:false}),deleteRecruiterById)
  // updates
  .patch("/recruiters/about/:id",passport.authenticate('recruiterStrategy',{session:false}),updateRecruiterAbout)
  .patch("/recruiters/contacts/:id",passport.authenticate('recruiterStrategy',{session:false}),updateRecruiterContacts)
  .patch("/recruiters/address/:id",passport.authenticate('recruiterStrategy',{session:false}),updateRecruiterAddress)
  .patch("/recruiters/name/:id",passport.authenticate('recruiterStrategy',{session:false}),updateRecruiterName)
  // profile Image
  .patch("/recruiters/image/:id",passport.authenticate('recruiterStrategy',{session:false}),uploadRecruiterProfile.single('image'),recruiterImageUpload)
  .patch("/recruiters/removeimage/:id",passport.authenticate('recruiterStrategy',{session:false}),uploadRecruiterProfile.single('image'),deleteRecruiterProfileImage)
  // get recruiter notifications getCandidateNotifications
.get(
  "/recruiters/notifications/:id",passport.authenticate('recruiterStrategy',{session:false}),
  getRecruiterNotifications
  
)
.patch("/recruiters/notifications/:id",passport.authenticate('recruiterStrategy',{session:false}),updateReadRecruiterNotifications)
export default recruiterRouter;



