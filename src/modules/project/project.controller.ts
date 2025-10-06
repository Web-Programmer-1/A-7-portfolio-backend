

import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import {   projectService } from "./project.service"
import { projectSchema } from "./project.validate"
import { prisma } from "../../config/db"


export const createProject = catchAsync(async (req: Request, res: Response) => {
  const validatedBody = await projectSchema.parseAsync(req.body)
  const project = await projectService.createProject({...validatedBody,
  authorId: req.user?.id} )
  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project
  })
})











export const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = (req.query.search as string) || ""
  const authorId = req.query.authorId ? Number(req.query.authorId) : undefined
  const features = req.query.features ? (req.query.features as string).split(",") : []

  const projects = await projectService.getAllProjects({ page, limit, search, authorId, features })

  res.status(200).json({
    success: true,
    message: "Projects retrieved successfully",
    data: projects
  })
});






export const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);


  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

 
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      clickCount: { increment: 1 },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Project fetched successfully & clickCount incremented.",
    data: updatedProject,
  });
});




export const updateProject =  catchAsync( async (req:Request, res:Response) => {

    const project = await projectService.updateProjects(Number(req.params.id), req.body);


    res.status(200).send({
        success:true,
        message:" Project Update  Successfully",
        data:project
    })
});

export const deleteProjectData = catchAsync( async (req:Request, res:Response) => {

    const project = await projectService.deleteProject(Number(req.params.id));


    res.status(200).send({
        success:true,
        message:" Project Delete  Successfully",
        data:project
    })
});



// ---------  Top project Views and Top Click Project Card Take in 5 data-----------

export const getTopClickedProjectsController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const topProjects = await projectService.getTopClickedProjects();

  res.status(200).json({
    success: true,
    message: "Top 4 most clicked projects retrieved successfully.",
    data: topProjects,
  });
});




