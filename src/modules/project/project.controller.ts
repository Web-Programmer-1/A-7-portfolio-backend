

import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { getTopClickedProjects,  projectService } from "./project.service"
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




// export const getProjectById = catchAsync( async (req:Request, res:Response) => {

//     const project = await projectService.getProjectID(Number(req.params.id));


//     res.status(200).send({
//         success:true,
//         message:"Single Project Get Successfully",
//         data:project
//     })
// });



export const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);

  // ✅ প্রথমে প্রজেক্টটা খুঁজে বের করো
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  // ✅ clickCount ১ বাড়াও এবং updated project ফেরত দাও
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



// export const getProjectByIdController = async (req: Request, res: Response) => {
  

 


//   const topClickedProjects = await getTopClickedProjects();

//   res.json({
//     success: true,
//     message: "Project retrieved & click count incremented successfully",
  
//     topClickedProjects, 
//   });
// };





// ✅ Get top 4 projects and increase clickCount
export const getTopClickedProjectsController = async (req: Request, res: Response) => {
  try {
    // Step 1: Get top 4 projects
    const topProjects = await prisma.project.findMany({
      orderBy: { clickCount: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        features: true,
        thumbnail: true,
        liveUrl: true,
        clickCount: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Step 2: Increase clickCount for each of them
    for (const project of topProjects) {
      await prisma.project.update({
        where: { id: project.id },
        data: { clickCount: { increment: 1 } },
      });
    }

    // Step 3: Return updated projects
    const updatedProjects = await prisma.project.findMany({
      orderBy: { clickCount: "desc" },
      take: 4,
    });

    res.status(200).json({
      success: true,
      message: "Top projects retrieved & clickCount incremented successfully.",
      data: updatedProjects,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching top projects.",
    });
  }
};