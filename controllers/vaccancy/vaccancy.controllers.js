import prisma from "../../lib/prisma.js";

export const getAllJobs = async (req, res) => {
  const skip = (Number(req.query.page) - 1) * 10;
  try {
    res.json(
      await prisma.job.findMany({
        skip,
        take: 10,
        orderBy: {
          dateUpdated: "desc",
        },
        where: {
          OR: req.query?.title?.split(" ")?.map((term) => ({
            title: {
              contains: term,
              mode: "insensitive",
            },
          })),
          AND: {
            city: {
              contains: req.query?.city,
              mode: "insensitive",
            },

            country: {
              contains: req.query?.country,
              mode: "insensitive",
            },
            field:
              req.query?.field === "all"
                ? {
                    not: req.query?.field,
                  }
                : {
                    equals: req.query?.field,
                  },
          },
        },
        include: {
          likedCandidates: {
            select: {
              candidateId: true,
            },
          },
          viewedCandidates: {
            select: {
              candidateId: true,
            },
          },
          candidatesApplied: {
            select: {
              id: true,
              jobsApplied: {
                select: {
                  id: true,
                },
              },
            },
          },
          recruiter: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    res.json(
      await prisma.job.findUnique({
        where: {
          id: Number(req.params.id),
        },
        select: {
          id: true,
          title: true,
          description: true,
          companyName: true,
          companyWebsite: true,
          country: true,
          city: true,
          salary: true,
          skills: true,
          condition: true,
          dateUpdated: true,
          field:true,
          recruiter: {
            select: {
              id: true,
              email: true,
              phone: true,
              image: true,
              firstName: true,
              lastName: true,
              rooms: {
                select: {
                  id: true,
                  candidateId: true,
                  name: true,
                },
              },
            },
          },
          likedCandidates: {
            select: {
              candidateId: true,
            },
          },
          viewedCandidates: {
            select: {
              id: true,
            },
          },
          candidatesApplied: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              jobsApplied: true,
              about: true,
              telegram: {
                select: {
                  chatId: true,
                  firstName: true,
                },
              },
              accepted: {
                select: {
                  jobsAccepted: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              refused: {
                select: {
                  jobsRefused: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const createJob = async (req, res) => {
  try {
    const created = await prisma.job.create({
      data: {
        ...req.body,
        salary: Number(req.body.salary),
      },
    });
    if (created) {
      res.json({
        message: "job successfully posted",
        posted: true,
      });
    } else {
      res.json({
        message: "error occured",
        posted: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
// update job

export const updateJob = async (req, res) => {
  try {
    const updated = await prisma.job.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        ...req.body,
        salary: Number(req.body.salary),
      },
    });
    if (updated) {
      res.json({
        message: "job successfully updated",
      });
    } else {
      res.json({
        message: "error occured",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteJobById = async (req, res) => {
  try {
    await prisma.job.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({
      message: "job successfully deleted",
    });
  } catch (error) {
    console.error(error);
  }
};
// job apply
export const appyJobById = async (req, res) => {
  try {
    // connect to the job
    await prisma.job.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        candidatesApplied: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
    });
    // connect on view
    await prisma.viewedCandidate.upsert({
      where: {
        candidateId: Number(req.body.id),
      },
      update: {
        viewedJobs: {
          connect: {
            id: Number(req.params.id),
          },
        },
      },
      create: {
        candidateId: Number(req.body.id),
        viewedJobs: {
          connect: {
            id: Number(req.params.id),
          },
        },
      },
    });
    // update letter
    await prisma.candidate.update({
      where: {
        id: Number(req.body.id),
      },
      data: {
        letter: req.body.message,
      },
    });
    res.json({
      message: "job successfully connected",
      connected:true
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "error",
      connected:false
    });
  }
};
// handle viewed Job
export const viewJobById = async (req, res) => {
  try {
    await prisma.viewedCandidate.upsert({
      where: {
        candidateId: Number(req.params.id),
      },
      update: {
        viewedJobs: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
      create: {
        candidateId: Number(req.params.id),
        viewedJobs: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
    });
    res.json({
      message: "job successfully viewed",
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "error flag",
    });
  }
};
// handle job like
export const likeJob = async (req, res) => {
  try {
    await prisma.likedJobs.upsert({
      where: {
        candidateId: Number(req.body.id),
      },
      update: {
        jobsLiked: {
          connect: {
            id: Number(req.params.id),
          },
        },
      },
      create: {
        candidateId: Number(req.body.id),
        jobsLiked: {
          connect: {
            id: Number(req.params.id),
          },
        },
      },
    });
    res.json({
      message: "job successfully liked",
    });
  } catch (error) {
    console.error(error);
  }
};

export const dislikeJob = async (req, res) => {
  try {
    await prisma.likedJobs.update({
      where: {
        candidateId: Number(req.body.id),
      },
      data: {
        jobsLiked: {
          disconnect: {
            id: Number(req.params.id),
          },
        },
      },
    });
    res.json({
      message: "job successfully disliked",
    });
  } catch (error) {
    console.error(error);
  }
};
// get liked jobs by user Id
export const getLikeJobsByUserId = async (req, res) => {
  try {
    res.json(
      await prisma.likedJobs.findUnique({
        where: {
          candidateId: Number(req.params.id),
        },

        include: {
          jobsLiked: {
            orderBy: {
              id: "desc",
            },
            include: {
              recruiter: {
                select: {
                  id: true,
                  email: true,
                },
              },
              viewedCandidates: {
                select: {
                  candidateId: true,
                },
              },
              candidatesApplied: {
                // where: {
                //   id: Number(req.params.id),
                // },
                select: {
                  id: true,
                  jobsApplied: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

// refuse candidate

export const refuseCandidate = async (req, res) => {
  try {
    await prisma.refusedCandidate.upsert({
      where: {
        candidateId: Number(req.params.id),
      },
      update: {
        jobsRefused: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
      create: {
        candidateId: Number(req.params.id),
        jobsRefused: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
    });
    const foundCandidate = await prisma.acceptedCandidate.findUnique({
      where: {
        candidateId: Number(req.params.id),
      },
    })
    if(foundCandidate){
      await prisma.acceptedCandidate.update({
        where: {
          candidateId: Number(req.params.id),
        },
        data: {
          jobsAccepted: {
            disconnect: {
              id: Number(req.body.id),
            },
          },
        },
      });
    }
    
    res.json({
      message: "job successfully refused",
    });
  } catch (error) {
    console.error(error);
  }
};
// accept candidate

export const acceptCandidate = async (req, res) => {
  try {
    await prisma.acceptedCandidate.upsert({
      where: {
        candidateId: Number(req.params.id),
      },
      update: {
        jobsAccepted: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
      create: {
        candidateId: Number(req.params.id),
        jobsAccepted: {
          connect: {
            id: Number(req.body.id),
          },
        },
      },
    });
    const foundCandidate = await prisma.refusedCandidate.findUnique({
      where: {
        candidateId: Number(req.params.id),
      },
    })
    if(foundCandidate){
      await prisma.refusedCandidate.update({
        where: {
          candidateId: Number(req.params.id),
        },
        data: {
          jobsRefused: {
            disconnect: {
              id: Number(req.body.id),
            },
          },
        },
      });
    }
    
    res.json({
      message: "job successfully accepted",
    });
  } catch (error) {
    console.error(error);
  }
};
// proposed candidate
export const proposeCandidateByJobId = async (req, res) => {
  try {
    const proposedCandidate = await prisma.proposedCandidate.upsert({
      where: {
        candidateId: Number(req.body.candidateId),
      },
      update: {
        recruiters: {
          connect: {
            id: Number(req.body.recruiterId),
          },
        },
        proposedJobs: {
          connect: {
            id: Number(req.params.id),
          },
        },
      },
      create: {
        candidateId: Number(req.body.candidateId),
        recruiters: {
          connect: {
            id: Number(req.body.recruiterId),
          },
        },
        proposedJobs: {
          connect: {
            id: Number(req.params.id),
          },
        },
      },
    });
    if (proposedCandidate) {
      res.json({
        message: "Candidate sussefully propsed",
        proposed: true,
      });
    } else {
      res.json({
        message: "We were unable to propose the candidate",
        proposed: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error occured",
      proposed: false,
    });
  }
};

export const getAllJobsApplied = async (req, res) => {
  try {
    const jobs = await prisma.candidate.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        jobsApplied: {
          orderBy: {
            id: "desc",
          },
          include: {
            recruiter: {
              select: {
                id: true,
              },
            },
            viewedCandidates: {
              select: {
                id: true,
              },
            },
            candidatesApplied: {
              select: {
                id: true,
              },
            },
          },
        },
        refused: {
          select: {
            jobsRefused: {
              select: {
                id: true,
              },
            },
          },
        },
        accepted: {
          select: {
            jobsAccepted: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
  }
};

export const getJobsByRecruiterId = async (req, res) => {
  try {
    res.json(
      await prisma.recruiter.findUnique({
        where: {
          id: Number(req.params.id),
        },
        include: {
          jobsPosted: {
            orderBy: {
              id: "desc",
            },
            select: {
              id: true,
              title: true,
              description: true,
              country: true,
              city: true,
              dateUpdated: true,
              candidatesApplied: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

// chats and rooms controllers
export const getAllRoomsByCandidateId = async (req, res) => {
  try {
    res.json(
      await prisma.room.findMany({
        where: {
          candidateId: Number(req.params.id),
        },
        orderBy: {
          dateUpdated: "desc",
        },
        select: {
          name: true,
          id: true,
          recruiter: {
            select: {
              id: true,
              companyName: true,
              firstName: true,
              online: true,
              lastSeen: true,
              image: true,
            },
          },
          chats: {
            // take:1,
            orderBy: {
              id: "desc",
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const getAllRoomsByRecruiterId = async (req, res) => {
  try {
    res.json(
      await prisma.room.findMany({
        where: {
          recruiterId: Number(req.params.id),
        },
        orderBy: {
          dateUpdated: "desc",
        },
        select: {
          name: true,
          id: true,
          candidate: {
            select: {
              id: true,
              firstName: true,
              online: true,
              image: true,
            },
          },
          chats: {
            // take:1,
            orderBy: {
              id: "desc",
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const createChat = async (req, res) => {
  try {
    res.json(
      await prisma.chat.create({
        data: {
          message: req.body.message,
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const getAllChatsByRoomId = async (req, res) => {
  try {
    res.json(
      await prisma.room.findUnique({
        where: {
          id: Number(req.params.id),
        },
        select: {
          name: true,
          candidate: {
            select: {
              lastSeen: true,
              online: true,
              firstName: true,
            },
          },
          recruiter: {
            select: {
              lastSeen: true,
              online: true,
              firstName: true,
            },
          },
          chats: {
            orderBy: {
              id: "asc",
            },
            select: {
              id: true,
              message: true,
              accountType: true,
              dateCreated: true,
              delivered: true,
              read: true,
            },
          },
        },
      })
    );
  } catch (error) {
    console.error(error);
  }
};

// export const updateChatsByRoomIdOnDeliverd = async (req, res) => {
//   try {
//     res.json(
//       await prisma.room.update({
//         where:{
//           id:Number(req.params.id)
//         },
//         data:{
//           chats:{
//             updateMany:{
//               where:{
//                 delivered:false
//               },
//               data:{
//                 delivered:true
//               }
//             }
//           }
//          }

//       })
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const updateChatsByRoomIdOnRead = async (req, res) => {
//   try {
//     res.json(
//       await prisma.room.update({
//         where:{
//           id:Number(req.params.id)
//         },
//         data:{
//           chats:{
//             updateMany:{
//               where:{
//                 read:false
//               },
//               data:{
//                 read:true
//               }
//             }
//           }
//          }

//       })
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };
