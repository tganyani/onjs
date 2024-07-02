import prisma from "../lib/prisma.js";
import { io } from "../index.js";
import { bot } from "../index.js";
export const socketHandeler = (socket) => {
  socket.on("createRoom", async (data) => {
    try {
      const foundRoom = await prisma.room.findUnique({
        where: {
          name: data.name,
        },
      });
      if (foundRoom) {
        await prisma.chat.create({
          data: {
            roomId: foundRoom.id,
            message: data.message,
            accountType: data.accountType,
          },
        });
        socket.join(data.name);
        io.to(data.name).emit("roomMsg", new Date());
        if (data?.propose) {
          await prisma.notification.create({
            data: {
              jobId: Number(data.vaccancyId),
              candidateId: Number(data.candidateId),
              roomId: foundRoom.id,
              companyName: data?.companyName,
              jobTitle: data?.jobTitle,
              invitation: true,
              proposal: true,
            },
          });
          io.emit("refreshNotification", new Date());
        }
        if (data?.apply) {
          await prisma.recruiterNotification.create({
            data: {
              jobId: Number(data.jobId),
              candidateId: Number(data.candidateId),
              recruiterId: Number(data.recruiterId),
              roomId: foundRoom.id,
              firstName: data?.firstName,
              lastName: data?.lastName,
              jobTitle: data?.jobTitle,
            },
          });
          io.emit("refreshRecruiterNotification", new Date());
        }
      } else {
        const create = await prisma.room.create({
          data: {
            name: data.name,
            candidateId: data.candidateId,
            recruiterId: data.recruiterId,
          },
        });
        if (create) {
          await prisma.chat.create({
            data: {
              roomId: create.id,
              message: data.message,
              accountType: data.accountType,
            },
          });
          if (data?.propose) {
            await prisma.notification.create({
              data: {
                jobId: Number(data.vaccancyId),
                candidateId: Number(data.candidateId),
                roomId: create.id,
                companyName: data?.companyName,
                jobTitle: data?.jobTitle,
                invitation: true,
                proposal: true,
              },
            });
            io.emit("refreshNotification", new Date());
          }
          if (data?.apply) {
            await prisma.recruiterNotification.create({
              data: {
                jobId: Number(data.jobId),
                candidateId: Number(data.candidateId),
                recruiterId: Number(data.recruiterId),
                roomId: create.id,
                firstName: data?.firstName,
                lastName: data?.lastName,
                jobTitle: data?.jobTitle,
              },
            });
            io.emit("refreshRecruiterNotification", new Date());
          }

          socket.join(data.name);
          io.to(data.name).emit("roomMsg", new Date());
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
  //   the socket to join all rooms
  socket.on("allRooms", async (data) => {
    const user =
      data.accountType === "candidate"
        ? await prisma.candidate.findUnique({
            where: {
              id: Number(data.id),
            },
            select: {
              rooms: {
                select: {
                  name: true,
                },
              },
            },
          })
        : await prisma.recruiter.findUnique({
            where: {
              id: Number(data.id),
            },
            select: {
              rooms: {
                select: {
                  name: true,
                },
              },
            },
          });

    if (user) {
      user?.rooms?.forEach(async (room) => {
        socket.join(room.name);
      });
    }
  });
  socket.on("joinRoom", (data) => {
    socket.join(data.roomName);
  });
  socket.on("newMsg", async (data) => {
    const created = await prisma.chat.create({
      data: {
        roomId: Number(data.roomId),
        message: data.message,
        accountType: data.accountType,
      },
    });
    if (created) {
      socket.join(data.roomName);
      io.to(data.roomName).emit("roomMsg", new Date());
      await prisma.room.update({
        where: {
          id: Number(data.roomId),
        },
        data: {
          dateUpdated: new Date(), // to update the room on new message so that we can oreder them properly
        },
      });
    }
  });
  socket.on("read", async (data) => {
    const updated = await prisma.room.update({
      where: {
        id: Number(data.roomId),
      },
      data: {
        chats: {
          updateMany: {
            where: {
              read: false,
              NOT: {
                accountType: data.accountType,
              },
            },
            data: {
              read: true,
            },
          },
        },
      },
    });
    if (updated) {
      socket.join(data.roomName);
      io.to(data.roomName).emit("refreshRead", new Date());
    }
  });
  socket.on("online", async (data) => {
    if (data.accountType === "candidate") {
      const updated = await prisma.candidate.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: true,
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
    if (data.accountType === "recruiter") {
      const updated = await prisma.recruiter.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: true,
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
  });
  socket.on("offline", async (data) => {
    if (data.accountType === "candidate") {
      const updated = await prisma.candidate.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: false,
          lastSeen: new Date(),
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
    if (data.accountType === "recruiter") {
      const updated = await prisma.recruiter.update({
        where: {
          id: Number(data.id),
        },
        data: {
          online: false,
          lastSeen: new Date(),
        },
      });
      if (updated) {
        io.emit("onlineUser", new Date());
      }
    }
  });
  socket.on("typing", (data) => {
    socket.join(data.roomName);
    socket.to(data.roomName).emit("typingUser", new Date());
  });
  socket.on("newJob", (data) => {
    io.emit("refreshJobs", new Date());
  });
  socket.on("newJobUpdate", (data) => {
    io.emit("refreshUpdateJob", new Date());
  });
  socket.on("newView", (data) => {
    io.emit("refreshNewView", new Date());
  });
  // telegram bot subsribe
  socket.on("sendInvitationMsg", async (data) => {
    await prisma.notification.create({
      data: {
        jobId: Number(data.vaccancyId),
        candidateId: Number(data.candidateId),
        roomId: data.roomId,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        invitation: true,
      },
    });
    io.emit("refreshNotification", new Date());
    if (data.chatId) {
      await bot.telegram.sendMessage(
        data.chatId,
        `You have recieved an  initation from ${data.companyName}, view more details about the job at https://jobsearch-lemon.vercel.app/${data.vaccancyId}  .Start conversation https://jobsearch-lemon.vercel.app/candidate/chats/${data.roomId} . With all respect ${data.fName} ${data.lName} `
      );
    }
  });
  socket.on("sendRefusalMsg", async (data) => {
    if (data.chatId) {
      await bot.telegram.sendMessage(
        data.chatId,
        `For now we are not ready to invite you at ${data.companyName} for this postion  https://jobsearch-lemon.vercel.app/${data.vaccancyId} , we have carefully viewed your profile, but this should not stop you from applying when we post new vaccancies . With all  respect ${data.fName} ${data.lName} `
      );
    }
    await prisma.notification.create({
      data: {
        jobId: Number(data.vaccancyId),
        candidateId: Number(data.candidateId),
        roomId: data.roomId,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        invitation: false,
      },
    });
    io.emit("refreshNotification", new Date());
  });
  socket.on("sendCandidateProposal", async (data) => {
    if (data.chatId) {
      await bot.telegram.sendMessage(
        data.chatId,
        `Hello ${data.firstName} you have received a job proposal for this position https://jobsearch-lemon.vercel.app/${data.vaccancyId}`
      );
    }
  });
};
