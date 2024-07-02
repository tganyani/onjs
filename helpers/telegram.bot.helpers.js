import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { io } from "../index.js";

const replyText1 =
  "!!!!!! We have automatically deleted your password for secruity reasons Jiiiiiiii";
const jobFields = [
  { id: 1, title: "general" },
  { id: 2, title: "arts" },
  { id: 3, title: "business" },
  { id: 4, title: "communications" },
  { id: 5, title: "education" },
  { id: 6, title: "health care" },
  { id: 7, title: "hospitality" },
  { id: 8, title: "information technology" },
  { id: 9, title: "law enforcement" },
  { id: 10, title: "sales and marketing" },
  { id: 11, title: "science" },
  { id: 12, title: "transportation" },
  { id: 13, title: "engineering" },
];

export const handleStart = async (ctx)=>{
    await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Welcome ${ctx.message.chat.first_name} to our telegram bot. This bot help you to browse for jobs. We kindly advise you to link it with your Imisebenzi account`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Link your Imisebenzi account",
                callback_data: "link_account",
              },
            ],
          ],
          // force_reply:true,
          // input_field_placeholder:"Enter your Email to link your account"
        },
      }
    );
  }

// call back handler
export const callBackHandler = async (ctx)=>{
    // Explicit usage
    // await ctx.telegram.answerCbQuery(ctx.callbackQuery.id, "Thank you");
    if (
      ctx.callbackQuery.message.text ===
      `? load more vacancies in ${ctx.callbackQuery.data?.split("-")[1]} field`
    ) {
      const fieldName = ctx.callbackQuery.data?.split("-")[1]=== "all"?" ":ctx.callbackQuery.data?.split("-")[1];
      const page = Number(ctx.callbackQuery.data?.split("-")[0]);
      const foundBestJobs = await prisma.job.findMany({
        skip: page  * 10,
        take: 10,
        where: {
          field: {
            contains: fieldName,
            mode: "insensitive",
          },
        },
        orderBy: {
          dateUpdated: "desc",
        },
        include: {
          candidatesApplied: {
            select: {
              id: true,
            },
          },
          viewedCandidates: {
            select: {
              id: true,
            },
          },
        },
      });
      if (foundBestJobs?.length) {
        foundBestJobs.forEach(async (job, i) => {
          await setTimeout(async () => {
            await ctx.telegram.sendMessage(
              ctx.callbackQuery.from.id,
              `${page*10 + i+1} <b>${
                job.title
              }</b>\n read more about the vacancy on https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${
                job.id
              } \n<b>${job?.candidatesApplied.length}</b> applied, <b>${
                job?.viewedCandidates.length
              }</b> viewed\n<b>salary</b>-$${job?.salary}, <b>country</b>-${
                job?.country
              }, <b>city</b>-${job?.city}
              `,
              {
                parse_mode: "HTML",
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "apply through web",
                        callback_data: "aply",
                        url: `https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${job.id}`,
                      },
                    ],
                  ],
                },
              }
            );
          }, i * 500);
        });
        setTimeout(async () => {
          await ctx.telegram.sendMessage(
            ctx.callbackQuery.from.id,
            `? load more vacancies in <b>${fieldName}</b> field`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "load more",
                      callback_data: `${page + 1}-${fieldName}`,
                    },
                  ],
                ],
              },
            }
          );
        }, foundBestJobs?.length * 500);
      } else {
        ctx.reply(
          `There are no more vacancies matching <b>${fieldName}</b> sector  so far ......`,{
            parse_mode: "HTML",
          }
        );
      }
    }
    if (
      ctx.callbackQuery.message.text ===
      `Welcome ${ctx.callbackQuery.from.first_name} to our telegram bot. This bot help you to browse for jobs. We kindly advise you to link it with your Imisebenzi account`
    ) {
      await ctx.telegram.sendMessage(
        ctx.callbackQuery.from.id,
        "Enter_your_email_which_you_use_to_log_to_Imisebenzi_account",
        {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: "email",
          },
        }
      );
    }
    if (ctx.callbackQuery.message.text.split("-")[0] === "choose profile") {
        console.log(ctx)
      const foundBestJobs = await prisma.job.findMany({
        where: {
          title: {
            contains: ctx.callbackQuery.data.split("-")[0],
            mode: "insensitive",
          },
        },
        orderBy: {
          dateUpdated: "desc",
        },
        include: {
          recruiter: {
            select: {
              id: true,
              email: true,
            },
          },
          candidatesApplied: {
            select: {
              id: true,
            },
          },
          viewedCandidates: {
            select: {
              id: true,
            },
          },
        },
      });
      if (foundBestJobs?.length) {
        ctx.reply(
          `We have found <b>${foundBestJobs?.length}</b> vacancies which match your profile`,
          {
            parse_mode: "HTML",
          }
        );
        foundBestJobs.forEach((job, i) => {
          setTimeout(async () => {
            await ctx.telegram.sendMessage(
              ctx.callbackQuery.from.id,
              `<b>${job.title}</b>\n read more about the vacancy on https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${job.id} \n<b>${job?.candidatesApplied.length}</b> applied, <b>${job?.viewedCandidates.length}</b> viewed\n<b>salary</b>-$${job?.salary}, <b>country</b>-${job?.country}, <b>city</b>-${job?.city}
              `,
              {
                parse_mode: "HTML",
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "apply through bot",
                        callback_data: `aply_through_bot-${job.id}-${
                          ctx.callbackQuery.data.split("-")[1]
                        }-${ctx.callbackQuery.data.split("-")[2]}-${
                          job.recruiter.id
                        }-${job.recruiter.email}`,
                      },
                      {
                        text: "apply through web",
                        callback_data: "aply",
                        url: `https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${job.id}`,
                      },
                    ],
                  ],
                },
              }
            );
          }, i * 500);
        });
      } else {
        ctx.reply("There are no vacancies matching your profile so far ......");
      }
    }
    if (ctx.callbackQuery.data?.split("-")[0] === "aply_through_bot") {
      ctx.reply("You want to apply through tele  bot");
      try {
        const message = `Hello I have applied to this position to this job through Imisebenzi telegram bot `;
        const candidateEmail = ctx.callbackQuery?.data.split("-")[3];
        const recruiterEmail = ctx.callbackQuery?.data.split("-")[5];
        const candidateId = ctx.callbackQuery?.data.split("-")[2];
        const recruiterId = ctx.callbackQuery?.data.split("-")[4];
        const roomName =
          candidateEmail < recruiterEmail
            ? "".concat(candidateEmail, recruiterEmail)
            : "".concat(recruiterEmail, candidateEmail);
        // connect to the job
        await prisma.job.update({
          where: {
            id: Number(ctx.callbackQuery?.data.split("-")[1]),
          },
          data: {
            candidatesApplied: {
              connect: {
                id: Number(ctx.callbackQuery?.data.split("-")[2]),
              },
            },
          },
        });
        //create room
        const foundRoom = await prisma.room.findUnique({
          where: {
            name: roomName,
          },
        });
        if (foundRoom) {
          await prisma.chat.create({
            data: {
              roomId: foundRoom.id,
              message,
              accountType: "candidate",
            },
          });
          // socket.join(data.name);
          io.to(roomName).emit("roomMsg", new Date());
        } else {
          const create = await prisma.room.create({
            data: {
              name: roomName,
              candidateId,
              recruiterId,
            },
          });
          if (create) {
            await prisma.chat.create({
              data: {
                roomId: create.id,
                message,
                accountType: "candidate",
              },
            });
            // socket.join(data.name);
            io.to(roomName).emit("roomMsg", new Date());
          }
        }
        // connect on view
        await prisma.viewedCandidate.update({
          where: {
            candidateId: Number(ctx.callbackQuery?.data.split("-")[2]),
          },
          data: {
            viewedJobs: {
              connect: {
                id: Number(ctx.callbackQuery?.data.split("-")[1]),
              },
            },
          },
        });
        ctx.reply("Job successfully connected");
      } catch (error) {
        console.error(error);
        ctx.reply("Error occured while connecting the job");
      }
    }
  }

export const handleBestJobs = async (ctx)=>{
    ctx.reply("You want to browse best jobs for profile");
    const foundSubscribers = await prisma.telegram.findMany({
      where: {
        chatId: ctx.message.chat.id,
      },
      include: {
        candidate: {
          select: {
            id: true,
            position: true,
            email: true,
          },
        },
      },
    });
    if(foundSubscribers.length){
      foundSubscribers.forEach(async (subsriber, i) => {
        await ctx.telegram.sendMessage(
          subsriber.chatId,
          `choose profile-${i + 1}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: subsriber.candidate?.position,
                    callback_data: `${subsriber.candidate?.position}-${subsriber.candidate?.id}-${subsriber.candidate?.email}`,
                  },
                ],
              ],
            },
          }
        );
      })
    }
    else{
      ctx.reply("We are unable to find your profile, make sure your <b>Imisebenzi account is linked</b> ",{
        parse_mode: "HTML",
      });
    }
  }

  export const handleSearch = async (ctx)=>{
    await ctx.reply("Enter job field or sector ", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "general",
            },
            {
              text: "information technology",
            },
          ],
          [
            {
              text: "arts",
            },
            {
              text: "business",
            },
          ],
          [
            {
              text: "communications",
            },
            {
              text: "education",
            },
          ],
          [
            {
              text: "health care",
            },
            {
              text: "hospitality",
            },
          ],
          [
            {
              text: "law enforcement",
            },
            {
              text: "sales and marketing",
            },
          ],
          [
            {
              text: "science",
            },
            {
              text: "transportation",
            },
          ],
          [
            {
              text: "engineering",
            },
            {
              text: "don't specify sector",
            },
          ],
        ],
      },
    });
  }

  export const handleText = async (ctx) => {
    // Explicit usage
    // console.log(ctx.message);
    // Using context shortcut
    if (
      ctx.message.reply_to_message?.text ===
      "Enter_your_email_which_you_use_to_log_to_Imisebenzi_account"
    ) {
      const user = await prisma.candidate.findUnique({
        where: {
          email: ctx.message.text,
        },
      });
      if (user) {
        await ctx.telegram.sendMessage(
          ctx.chat.id,
          `Enter_password_for-${ctx.message.text}`,
          {
            reply_markup: {
              force_reply: true,
              input_field_placeholder: "Enter your password",
            },
          }
        );
      } else {
        await ctx.reply(`We were unable to find  your Imisebenzi account`);
      }
    } else if (
      ctx.message.reply_to_message?.text.split("-")[0] === "Enter_password_for"
    ) {
      const user = await prisma.candidate.findUnique({
        where: {
          email: ctx.message.reply_to_message?.text.split("-")[1],
        },
      });
      const result = await bcrypt.compare(ctx.message.text, user.password);
      if (result) {
        const foundSubscriber = await prisma.telegram.findUnique({
          where: {
            candidateId: user.id,
          },
        });
        if (foundSubscriber) {
          await ctx.reply(
            `Hie ${ctx.message.chat.first_name}  your Imisebenzi account is already linked`
          );
          await ctx.deleteMessage(ctx.message.message_id);
          await ctx.reply(replyText1);
        } else {
          const subsriber = await prisma.telegram.create({
            data: {
              chatId: ctx.message.chat.id,
              firstName: ctx.message.chat.first_name,
              candidateId: user.id,
            },
          });
          if (subsriber) {
            await ctx.reply(
              `Thank you ${ctx.message.chat.first_name} for linking your Imisebenzi account`
            );
            await ctx.deleteMessage(ctx.message.message_id);
            await ctx.reply(replyText1);
          } else {
            await ctx.reply(`We were unable to link your account`);
            await ctx.deleteMessage(ctx.message.message_id);
            await ctx.reply(replyText1);
          }
        }
      } else {
        await ctx.reply(`wrong email or password`);
        await ctx.deleteMessage(ctx.message.message_id);
        await ctx.reply(replyText1);
      }
    } 
    else if(ctx.message.text === "don't specify sector"){
      const foundField = "all"
      const foundBestJobs = await prisma.job.findMany({
        skip: 0,
        take: 10,
        orderBy: {
          dateUpdated: "desc",
        },
        include: {
          candidatesApplied: {
            select: {
              id: true,
            },
          },
          viewedCandidates: {
            select: {
              id: true,
            },
          },
        },
      });
      if (foundBestJobs?.length) {
       await ctx.reply(
          `The first  <b>${foundBestJobs?.length}</b> vacancies which match  <b>${foundField}</b> sector`,
          {
            parse_mode: "HTML",
          }
        );
        await foundBestJobs.forEach(async (job, i) => {
          await setTimeout(async () => {
            await ctx.telegram.sendMessage(
              ctx.message.from.id,
              `${i + 1} <b>${
                job.title
              }</b>\n read more about the vacancy on https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${
                job.id
              } \n<b>${job?.candidatesApplied.length}</b> applied, <b>${
                job?.viewedCandidates.length
              }</b> viewed\n<b>salary</b>-$${job?.salary}, <b>country</b>-${
                job?.country
              }, <b>city</b>-${job?.city}
              `,
              {
                parse_mode: "HTML",
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "apply through web",
                        callback_data: "aply",
                        url: `https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${job.id}`,
                      },
                    ],
                  ],
                },
              }
            );
          }, i * 500);
        });
        setTimeout(async () => {
          await ctx.telegram.sendMessage(
            ctx.message.from.id,
            `? load more vacancies in <b>${foundField}</b> field`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "load more", callback_data: `1-${foundField}` }],
                ],
              },
            }
          );
        }, foundBestJobs?.length * 500);
      } else {
        ctx.reply(
          `There are no vacancies matching <b>${foundField}</b> so far ......`
        );
      }
    }
    else {
      const foundField = jobFields.filter(
        (field) => field.title === ctx.message.text
      )[0]?.title;
      if (foundField) {
        const foundBestJobs = await prisma.job.findMany({
          skip: 0,
          take: 10,
          where: {
            field: {
              contains: foundField,
              mode: "insensitive",
            },
          },
          orderBy: {
            dateUpdated: "desc",
          },
          include: {
            candidatesApplied: {
              select: {
                id: true,
              },
            },
            viewedCandidates: {
              select: {
                id: true,
              },
            },
          },
        });
        if (foundBestJobs?.length) {
         await ctx.reply(
            `The first  <b>${foundBestJobs?.length}</b> vacancies which match  <b>${foundField}</b> sector`,
            {
              parse_mode: "HTML",
            }
          );
          await foundBestJobs.forEach(async (job, i) => {
            await setTimeout(async () => {
              await ctx.telegram.sendMessage(
                ctx.message.from.id,
                `${i + 1} <b>${
                  job.title
                }</b>\n read more about the vacancy on https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${
                  job.id
                } \n<b>${job?.candidatesApplied.length}</b> applied, <b>${
                  job?.viewedCandidates.length
                }</b> viewed\n<b>salary</b>-$${job?.salary}, <b>country</b>-${
                  job?.country
                }, <b>city</b>-${job?.city}
                `,
                {
                  parse_mode: "HTML",
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: "apply through web",
                          callback_data: "aply",
                          url: `https://jobsearch-jyxwcwmo1-tganyanis-projects.vercel.app/${job.id}`,
                        },
                      ],
                    ],
                  },
                }
              );
            }, i * 500);
          });
          setTimeout(async () => {
            await ctx.telegram.sendMessage(
              ctx.message.from.id,
              `? load more vacancies in <b>${foundField}</b> field`,
              {
                parse_mode: "HTML",
                reply_markup: {
                  inline_keyboard: [
                    [{ text: "load more", callback_data: `1-${foundField}` }],
                  ],
                },
              }
            );
          }, foundBestJobs?.length * 500);
        } else {
          ctx.reply(
            `There are no vacancies matching <b>${foundField}</b> so far ......`
          );
        }
      } else {
        await ctx.reply(`Hello ${ctx.message.text}`);
      }
    }
    // console.log(ctx.message);
  }


