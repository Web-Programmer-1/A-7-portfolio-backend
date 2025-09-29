import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject } from "./project.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";

const projectRoute = express.Router();

projectRoute.post("/", authenticateJWT, authorizeRoles("ADMIN", "USER"),createProject );

projectRoute.get("/", authenticateJWT, authorizeRoles("ADMIN", "USER"), getAllProjects);

projectRoute.get("/:id", authenticateJWT, authorizeRoles("USER", "ADMIN"), getProjectById);
projectRoute.put("/:id", authenticateJWT, authorizeRoles("USER", "ADMIN"), updateProject);



export default projectRoute;