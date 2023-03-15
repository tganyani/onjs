import prisma from "../../lib/prisma.js";

export const createCandateSkills = async (req, res) => {
  try {
    const created = await prisma.skills.create({
      data: {...req.body, experience:Number(req.body.experience)},
    });
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};

export const updateCandateSkills = async (req, res) => {
  try {
    const updated = await prisma.skills.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        experience: Number(req.body.experience),
      },
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCandateSkills = async (req, res) => {
  try {
    const deleted = await prisma.skills.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
  }
};

export const getAllCandateSkills = async (req, res) => {
  try {
    const all = await prisma.skills.findMany({
      where: {
        candidateId: Number(req.params.id),
      },
    });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};
