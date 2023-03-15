import prisma from "../../lib/prisma.js";

export const createCandatePreviousPosition = async (req, res) => {
  try {
    const created = await prisma.previousPosition.create({
      data: req.body,
    });
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};

export const updateCandatePreviousPosition = async (req, res) => {
  try {
    const updated = await prisma.previousPosition.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        companyName: req.body.companyName,
        position:req.body.position,
        startDate:req.body.startDate,
        endDate:req.body.endDate
      },
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCandatePreviousPosition = async (req, res) => {
  try {
    const deleted = await prisma.previousPosition.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
  }
};

export const getAllCandatePreviousPosition = async (req, res) => {
  try {
    const all = await prisma.previousPosition.findMany({
      where: {
        candidateId: Number(req.params.id),
      },
    });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};