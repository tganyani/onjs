import express, { text } from "express";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import prisma from "./lib/prisma.js";
// import path from "path";
// import os from "os";
// import FormData from "express-form-data";

import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import candidateRouter from "./routes/candidate.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import vaccancyRouter from "./routes/vaccancy.routes.js";

import { candidateStrategy } from "./middleware/candidate.auth.middleware.js";
import { recruiterStrategy } from "./middleware/recruiter.auth.middleware.js";
import { hybridStrategy } from "./middleware/hybrid.auth.middleware.js";
import { callBackHandler, handleBestJobs, handleSearch, handleStart, handleText } from "./helpers/telegram.bot.helpers.js";
import { socketHandeler } from "./helpers/socket.io.helpers.js";

const app = express();
const httpServer = createServer(app);

// telegram bot

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// Options for formdata
// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true
// };

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

// app.use(FormData.parse(options));

app.use(candidateRouter);
app.use(recruiterRouter);
app.use(vaccancyRouter);
app.use(passport.initialize());

passport.use("recruiterStrategy", recruiterStrategy);
passport.use("candidateStrategy", candidateStrategy);
passport.use("hybridStrategy", hybridStrategy);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", socketHandeler);

bot.start(handleStart);

bot.on("callback_query", callBackHandler);
bot.command("bestjobs", handleBestJobs);

bot.command("search", handleSearch);

bot.on(message("text"), handleText);

bot.launch();

const port = process.env.PORT || 5000;

httpServer.listen(port, () =>
  console.log(`The server is up running on port ${port}`)
);
