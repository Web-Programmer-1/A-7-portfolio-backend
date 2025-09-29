import { Blog, Prisma } from "@prisma/client"
import { prisma } from "../../config/db"




const createBlog = async (payload:Prisma.BlogCreateInput):Promise<Blog> => {

    const blog = await prisma.blog.create({
        data:payload
    })


    return blog
};

// const getAllBlogs = async () => {

//     const userBlog = await prisma.blog.findMany();
//     if(!userBlog){
//         throw new Error("Blog Data Not Found")
//     }

//     return userBlog

// };


const getAllBlogs = async () => {

  const userBlog = await prisma.blog.findMany({
    select: {
      id: true,         
      title: true,      
      content: true,    
      createAt: true,   
      updateAt: true,  
      author: {
        select: {
            id:true,
          name: true,
          email:true,
          createAt:true,
          updateAt:true

        }
      }
    }
  });

  if (!userBlog || userBlog.length === 0) {
    throw new Error("Blog Data Not Found");
  }

  return userBlog;
};




const getBlogById = async (id:number) => {
    const singleBlog = await prisma.blog.findUnique({
        where:{id}
    })

    return singleBlog
}



// Update Blog

const updateBlogs = async (id:number, data:any) => {
    const blog = await prisma.blog.update({
        where:{
            id:id
        },
        data:data
    })

    return blog
}


// delete blog 

const deleteBlog = async (id:number) => {
    const del= await prisma.blog.delete({
        where: {id}
    })

    return deleteBlog
}

export const blogService = {
    createBlog,
    getAllBlogs,
    getBlogById,
    deleteBlog,
    updateBlogs,

}