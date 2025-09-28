import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { blogService } from "./blog.service";



export const createBlog = catchAsync(async(req:Request, res:Response) => {

    const blog = await blogService.createBlog(req.body);
    if(!blog){
        throw new Error("Blog Not Found")
    }


    res.status(201).send({
        success:true,
        message:"Blog Data Created Successfully",
        data: blog
    })
});

export const getAllBlog = catchAsync(async(req:Request, res:Response) => {

    const BlogData = await blogService.getAllBlogs();
    
 


    res.status(201).send({
        success:true,
        message:"Blog All Data Retrived Successfully",
        data:BlogData
    })
});

export const getBlogById = catchAsync(async(req:Request, res:Response) => {

    const singleBlog = await blogService.getBlogById(Number(req.params.id))


    res.status(201).send({
        success:true,
        message:"Blog All Data Retrived Successfully",
        data:singleBlog
    })
});