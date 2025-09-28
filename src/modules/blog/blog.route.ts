import express from "express";
import { createBlog, getAllBlog } from "./blog.controller";

const blogRouter = express.Router();



blogRouter.post("/", createBlog);
blogRouter.get("/", getAllBlog);

export default blogRouter;