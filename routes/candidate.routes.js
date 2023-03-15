import express from "express";
import passport from "passport";
import {
  createCandateContact,
  deleteCandateContact,
  getAllCandateContact,
  updateCandateContact,
} from "../controllers/candidate/candidate.contacts.controller.js";
const candidateRouter = express.Router();

// importing controllers
import {
  getAllCandidates,
  getCandidateById,
  getCandidateByEmail,
  createCandidate,
  deleteCandidateById,
  candidateLogin,
  imageUpload,
  updateProfile,
  updateAbout,
} from "../controllers/candidate/candidate.controllers.js";
import {
  createCandatePreviousPosition,
  deleteCandatePreviousPosition,
  getAllCandatePreviousPosition,
  updateCandatePreviousPosition,
} from "../controllers/candidate/candidate.previousPosition.controller.js";
import {
  createCandateProject,
  deleteCandateProject,
  getAllCandateProject,
  updateCandateProject,
} from "../controllers/candidate/candidate.projects.controller.js";
import {
  createCandateSkills,
  deleteCandateSkills,
  getAllCandateSkills,
  updateCandateSkills,
} from "../controllers/candidate/candidate.skills.controller.js";

import {
  createCandateEducation,
  deleteCandateEducation,
  getAllCandateEducation,
  updateCandateEducation,
} from "../controllers/candidate/candidateEducation.controller.js";
import { uploadCandidateProfile } from "../middleware/candidate.file.upload.middleware.js";

candidateRouter
  .get(
    "/candidates"
    ,
    // passport.authenticate("jwt", { session: false }),
     getAllCandidates
  )
  .get("/candidates/:id", getCandidateById)
  .post("/candidates/email", getCandidateByEmail)
  .post("/candidates", createCandidate)
  .post("/candidates/login", candidateLogin)
  .delete(
    "/candidates/:id",
    passport.authenticate("jwt", { session: false }),
    deleteCandidateById
  )
  // education routes
  .post("/candidates/edu", createCandateEducation)
  .patch("/candidates/edu/:id", updateCandateEducation)
  .delete("/candidates/edu/:id", deleteCandateEducation)
  .get("/candidates/edu/:id", getAllCandateEducation)
  // previous positions routes
  .post("/candidates/pos", createCandatePreviousPosition)
  .patch("/candidates/pos/:id", updateCandatePreviousPosition)
  .delete("/candidates/pos/:id", deleteCandatePreviousPosition)
  .get("/candidates/pos/:id", getAllCandatePreviousPosition)
  // skills routes
  .post("/candidates/skills", createCandateSkills)
  .patch("/candidates/skills/:id", updateCandateSkills)
  .delete("/candidates/skills/:id", deleteCandateSkills)
  .get("/candidates/skills/:id", getAllCandateSkills)
  // projects routes
  .post("/candidates/projects", createCandateProject)
  .patch("/candidates/projects/:id", updateCandateProject)
  .delete("/candidates/projects/:id", deleteCandateProject)
  .get("/candidates/projects/:id", getAllCandateProject)
  // contacts routes
  .post("/candidates/contacts", createCandateContact)
  .patch("/candidates/contacts/:id", updateCandateContact)
  .delete("/candidates/contacts:id", deleteCandateContact)
  .get("/candidates/contacts/:id", getAllCandateContact)

  // profile image
  .patch("/candidates/image/:id",uploadCandidateProfile.single('image'),imageUpload)
  .patch("/candidates/profile/:id",updateProfile)
  .patch("/candidates/about/:id",updateAbout)

export default candidateRouter;
