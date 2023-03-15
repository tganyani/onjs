import prisma from "../../lib/prisma.js";

export const createCandateEducation = async (req, res) => {
  try {
    const created = await prisma.education.create({
      data: req.body,
    });
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};

export const updateCandateEducation = async (req, res) => {
  try {
    const updated = await prisma.education.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        schoolName: req.body.schoolName,
        startDate: req.body.startDate,
        endDate:req.body.endDate
      },
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCandateEducation = async (req, res) => {
  try {
    const deleted = await prisma.education.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
  }
};

export const getAllCandateEducation = async (req, res) => {
  try {
    const all = await prisma.education.findMany({
      where: {
        candidateId: Number(req.params.id),
      },
    });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};
