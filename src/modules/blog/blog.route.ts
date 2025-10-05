import express from "express";
import { createBlog, deleteBlogData, getAllBlog, getBlogById, updateBlog } from "./blog.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";

const blogRouter = express.Router();



blogRouter.post("/", authenticateJWT, authorizeRoles("ADMIN"), createBlog);
blogRouter.get("/",  authenticateJWT, authorizeRoles("ADMIN", "USER"),getAllBlog);
blogRouter.get("/:id", authenticateJWT, authorizeRoles("ADMIN", "USER"), getBlogById);
blogRouter.put("/:id",  authenticateJWT, authorizeRoles("ADMIN", "USER"),updateBlog)
blogRouter.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), deleteBlogData );

export default blogRouter;