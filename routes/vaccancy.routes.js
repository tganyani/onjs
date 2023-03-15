import express from "express";
import {
    acceptCandidate,
  appyJobById,
  createChat,
  createJob,
  deleteJobById,
  deleteLetterById,
  dislikeJob,
  getAllChatsByRoomId,
  getAllJobs,
  getAllJobsApplied,
  getAllLetters,
  getAllRoomsByCandidateId,
  getAllRoomsByRecruiterId,
  getJobById,
  getJobsByRecruiterId,
  getLikeJobsByUserId,
  likeJob,
  proposeCandidateByJobId,
  refuseCandidate,
  updateJob,
} from "../controllers/vaccancy/vaccancy.controllers.js";

const vaccancyRouter = express.Router();

vaccancyRouter
  .get("/vaccancy", getAllJobs)
  .get("/vaccancy/:id", getJobById)
  .post("/vaccancy", createJob)
  .patch("/vaccancy/:id",updateJob)
  .delete("/vaccancy/:id", deleteJobById)

  // apply for a job
  .patch("/vaccancy/connect/:id", appyJobById)
  // get all jobs user connected
  .get("/vaccancy/connected/:id", getAllJobsApplied)
  // get all jobs posted by recruiter
  .get("/vaccancy/posted/:id", getJobsByRecruiterId)
  // handle candidate refusal
  .post("/vaccancy/refuse/:id", refuseCandidate)
  // handle candidate acceptance 
  .post("/vaccancy/accept/:id", acceptCandidate)
  // propose candidate
  .post("/vaccancy/propose/:id",proposeCandidateByJobId)

  // get all letters by candidate id
  .get("/vaccancy/letters/:id",getAllLetters)
  .delete("/vaccancy/letters/:id",deleteLetterById)

  // chats and rooms
  .get("/rooms/candidate/:id",getAllRoomsByCandidateId)
  .get("/rooms/recruiter/:id",getAllRoomsByRecruiterId)
  .get("/rooms/:id",getAllChatsByRoomId)
  // .post("/chats",createChat)

  // like and dislike job
  .get("/vaccancy/liked/:id",getLikeJobsByUserId)
  .patch("/vaccancy/like/:id",likeJob)
  .patch("/vaccancy/dislike/:id",dislikeJob)
  
export default vaccancyRouter;
