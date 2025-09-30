
import { Project } from "@prisma/client"
import { prisma } from "../../config/db"
import { IProjectPagination } from "./project.interface"



const createProject = async (payload: {
  title: string
  description: string
  features: string[]
  thumbnail: string[]
  liveUrl: string
  authorId: number
}): Promise<Project> => {
  return await prisma.project.create({
    data: {
      title: payload.title,
      description: payload.description,
      features: payload.features,
      thumbnail: payload.thumbnail,
      liveUrl: payload.liveUrl,
      user: {
        connect: { id: payload.authorId }
      }
    }
  })
}

const getAllProjects = async ({ page, limit, search, authorId, features }: IProjectPagination) => {
  const skip = (page - 1) * limit

  const where: any = {}

  if (search && search.trim() !== "") {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ]
  }

  if (authorId) {
    where.authorId = authorId
  }

  if (features && features.length > 0) {
    where.features = { hasEvery: features }
  }

  const data = await prisma.project.findMany({
    skip,
    take: limit,
    where,
    orderBy: { id: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  })

  const total = await prisma.project.count({ where })

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
};


// todo Get project Single Id 

const getProjectID = async (id:number) => {

    const project = await prisma.project.findUnique({
        where:{id}
    })

    return project

};



const updateProjects = async (id:number, payload:any) => {

      const existing = await prisma.project.findUnique({ where: { id } })
   if (!existing) {
    throw new Error("Project not found with this ID");
  }

    const project = await prisma.project.update({
        where: {id},
        data:payload

    })

    return project
};



const deleteProject = async (id:number) => {
    const ProjectData = await prisma.project.delete({
        where:{id}

    });

    return ProjectData
}







export const getProjectByIdAndIncrement = async (id: number) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return null;

  const updated = await prisma.project.update({
    where: { id },
    data: {
      clickCount: { increment: 1 },
    },
  });

  return updated;
};











export const projectService = {
  createProject,
  getAllProjects,
  getProjectID,
  updateProjects,
  deleteProject,

}
