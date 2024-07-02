import express from "express";
import passport from "passport";

import {
    acceptCandidate,
  appyJobById,
  createChat,
  createJob,
  deleteJobById,
  dislikeJob,
  getAllChatsByRoomId,
  getAllJobs,
  getAllJobsApplied,
  getAllRoomsByCandidateId,
  getAllRoomsByRecruiterId,
  getJobById,
  getJobsByRecruiterId,
  getLikeJobsByUserId,
  likeJob,
  proposeCandidateByJobId,
  refuseCandidate,
  updateJob,
  viewJobById,
} from "../controllers/vaccancy/vaccancy.controllers.js";

const vaccancyRouter = express.Router();

vaccancyRouter
  .get("/vaccancy",passport.authenticate("candidateStrategy", { session: false }), getAllJobs)
  .get("/vaccancy/:id",passport.authenticate("hybridStrategy", { session: false }), getJobById)
  .post("/vaccancy",passport.authenticate('recruiterStrategy',{session:false}), createJob)
  .patch("/vaccancy/:id",passport.authenticate('recruiterStrategy',{session:false}),updateJob)
  .delete("/vaccancy/:id",passport.authenticate('recruiterStrategy',{session:false}), deleteJobById)

  // apply for a job
  .patch("/vaccancy/connect/:id",passport.authenticate("candidateStrategy", { session: false }), appyJobById)
  // get all jobs user connected
  .get("/vaccancy/connected/:id",passport.authenticate("candidateStrategy", { session: false }), getAllJobsApplied)
  // get all jobs posted by recruiter
  .get("/vaccancy/posted/:id",passport.authenticate('recruiterStrategy',{session:false}), getJobsByRecruiterId)
  // handle candidate refusal
  .post("/vaccancy/refuse/:id",passport.authenticate("candidateStrategy", { session: false }), refuseCandidate)
  // handle candidate acceptance 
  .post("/vaccancy/accept/:id",passport.authenticate("candidateStrategy", { session: false }), acceptCandidate)
  // propose candidate
  .post("/vaccancy/propose/:id",passport.authenticate("candidateStrategy", { session: false }),proposeCandidateByJobId)


  // chats and rooms
  .get("/rooms/candidate/:id",passport.authenticate("candidateStrategy", { session: false }),getAllRoomsByCandidateId)
  .get("/rooms/recruiter/:id",passport.authenticate('recruiterStrategy',{session:false}),getAllRoomsByRecruiterId)
  .get("/rooms/:id",passport.authenticate("hybridStrategy", { session: false }),getAllChatsByRoomId)
  // .post("/chats",createChat)

  // like and dislike job
  .get("/vaccancy/liked/:id",passport.authenticate("candidateStrategy", { session: false }),getLikeJobsByUserId)
  .patch("/vaccancy/like/:id",passport.authenticate("candidateStrategy", { session: false }),likeJob)
  .patch("/vaccancy/dislike/:id",passport.authenticate("candidateStrategy", { session: false }),dislikeJob)
  // handle view job
  .patch("/vaccancy/view/:id",passport.authenticate("candidateStrategy", { session: false }),viewJobById)
  
export default vaccancyRouter;
