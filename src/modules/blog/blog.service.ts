import { Blog, Prisma } from "@prisma/client"
import { prisma } from "../../config/db"




const createBlog = async (payload:Prisma.BlogCreateInput):Promise<Blog> => {

    const blog = await prisma.blog.create({
        data:payload
    })


    return blog
};

const getAllBlogs = async () => {

    const userBlog = await prisma.blog.findMany();
    if(!userBlog){
        throw new Error("Blog Data Not Found")
    }

    return userBlog

};

const getBlogById = async (id:number) => {
    const singleBlog = await prisma.blog.findUnique({
        where:{id}
    })

    return singleBlog
}


export const blogService = {
    createBlog,
    getAllBlogs,
    getBlogById,

}