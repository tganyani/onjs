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
  refreshCandidateToken,
  deleteCandidateProfileImage,
  getCandidateLetter,
  getCandidateNotifications,
  updateReadCandidateNotifications,
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
import { uploadCandidateProjectImages } from "../middleware/candidate.projectImage.upload.js";

candidateRouter
  .get(
    "/candidates",
    passport.authenticate('recruiterStrategy',{session:false}),
    getAllCandidates
  )
  .get(
    "/candidates/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    getCandidateById
  )
  .post("/candidates/email", getCandidateByEmail)
  .post("/candidates", createCandidate)
  .post("/candidates/login", candidateLogin)
  .delete(
    "/candidates/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandidateById
  )
  // refresh token
  .post("/candidates/refresh", refreshCandidateToken)
  // education routes
  .post(
    "/candidates/edu",
    passport.authenticate("candidateStrategy", { session: false }),
    createCandateEducation
  )
  .patch(
    "/candidates/edu/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    updateCandateEducation
  )
  .delete(
    "/candidates/edu/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandateEducation
  )
  .get(
    "/candidates/edu/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    getAllCandateEducation
  )
  // previous positions routes
  .post(
    "/candidates/pos",
    passport.authenticate("candidateStrategy", { session: false }),
    createCandatePreviousPosition
  )
  .patch(
    "/candidates/pos/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    updateCandatePreviousPosition
  )
  .delete(
    "/candidates/pos/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandatePreviousPosition
  )
  .get(
    "/candidates/pos/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    getAllCandatePreviousPosition
  )
  // skills routes
  .post(
    "/candidates/skills",
    passport.authenticate("candidateStrategy", { session: false }),
    createCandateSkills
  )
  .patch(
    "/candidates/skills/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    updateCandateSkills
  )
  .delete(
    "/candidates/skills/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandateSkills
  )
  .get(
    "/candidates/skills/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    getAllCandateSkills
  )
  // projects routes
  .post(
    "/candidates/projects",
    passport.authenticate("candidateStrategy", { session: false }),uploadCandidateProjectImages.array('projects'),
    createCandateProject
  )
  .patch(
    "/candidates/projects/:id",
    passport.authenticate("candidateStrategy", { session: false }),uploadCandidateProjectImages.array('projects'),
    updateCandateProject
  )
  .delete(
    "/candidates/projects/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandateProject
  )
  .get(
    "/candidates/projects/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    getAllCandateProject
  )
  // contacts routes
  .post(
    "/candidates/contacts",
    passport.authenticate("candidateStrategy", { session: false }),
    createCandateContact
  )
  .patch(
    "/candidates/contacts/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    updateCandateContact
  )
  .delete(
    "/candidates/contacts:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandateContact
  )
  .get(
    "/candidates/contacts/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    getAllCandateContact
  )

  // profile image
  .patch(
    "/candidates/image/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    uploadCandidateProfile.single("image"),
    imageUpload
  )
  .patch(
    "/candidates/profile/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    updateProfile
  )
  // delete candidate profile image
  .patch(
    "/candidates/removeimage/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    deleteCandidateProfileImage
  )
  .patch(
    "/candidates/about/:id",
    passport.authenticate("candidateStrategy", { session: false }),
    updateAbout
  )
// get candidate letter
.get(
  "/candidates/letter/:id",
  passport.authenticate("candidateStrategy", { session: false }),
  getCandidateLetter
)
// get candidate notifications getCandidateNotifications
.get(
  "/candidates/notifications/:id",
  passport.authenticate("candidateStrategy", { session: false }),
  getCandidateNotifications
  
)
.patch("/candidates/notifications/:id",
  passport.authenticate("candidateStrategy", { session: false }),updateReadCandidateNotifications)

  export default candidateRouter;
