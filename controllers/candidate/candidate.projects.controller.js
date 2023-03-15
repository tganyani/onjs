import prisma from "../../lib/prisma.js";

export const createCandateProject = async (req, res) => {
  try {
    const created = await prisma.projects.create({
      data: req.body,
    });
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};

export const updateCandateProject = async (req, res) => {
  try {
    const updated = await prisma.projects.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        link: req.body.link
      },
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCandateProject = async (req, res) => {
  try {
    const deleted = await prisma.projects.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
  }
};

export const getAllCandateProject = async (req, res) => {
  try {
    const all = await prisma.projects.findMany({
      where: {
        candidateId: Number(req.params.id),
      },
    });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};
