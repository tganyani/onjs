import prisma from "../../lib/prisma.js";

export const createCandateContact = async (req, res) => {
  try {
    const created = await prisma.contacts.create({
      data: req.body,
    });
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};

export const updateCandateContact = async (req, res) => {
  try {
    const updated = await prisma.contacts.upsert({
      where: {
        candidateId: Number(req.params.id),
      },
      update: {
        phone:req.body.phone,
        email:req.body.email
      },
      create: {
        phone:req.body.phone,
        email:req.body.email,
        candidateId:Number(req.params.id)
      },
      
    });
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCandateContact = async (req, res) => {
  try {
    const deleted = await prisma.contacts.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
  }
};

export const getAllCandateContact = async (req, res) => {
  try {
    const all = await prisma.contacts.findMany({
      where: {
        candidateId: Number(req.params.id),
      },
    });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};
