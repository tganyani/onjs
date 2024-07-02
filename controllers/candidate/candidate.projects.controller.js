import prisma from "../../lib/prisma.js";
import { v4 as uuidv4 } from "uuid";


export const createCandateProject = async (req, res) => {
  try {
    const images = await req.files.map((file)=>({id:uuidv4(),url:file.filename}))
    const created = await prisma.projects.create({
      data: {
        title: req.body.title,
        link: req.body.link,
        description:req.body.description,
        candidateId:Number(req.body.candidateId),
        images
      },
    });
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};

export const updateCandateProject = async (req, res) => {
  try {
  const newImages = await req.files.map((file)=>({id:uuidv4(),url:file.filename}))
  const prevImages = Number(req.body?.len)> 1 ? await req.body?.initialImages?.map((file)=>({url:file,id:uuidv4()})):[{id:uuidv4(),url:req.body?.initialImages}]
    const updated = await prisma.projects.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        link: req.body.link,
        description:req.body.description,
        images:[...prevImages,...newImages],
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


