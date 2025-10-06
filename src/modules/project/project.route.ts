import express from "express";
import { createProject, deleteProjectData, getAllProjects,  getProjectById,  getTopClickedProjectsController,  updateProject } from "./project.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";

const projectRoute = express.Router();

projectRoute.post("/", authenticateJWT, authorizeRoles("ADMIN"),createProject );

projectRoute.get("/", authenticateJWT, authorizeRoles("ADMIN", "USER"), getAllProjects);


projectRoute.put("/:id", authenticateJWT, authorizeRoles("ADMIN", "USER"), updateProject);

projectRoute.delete("/:id", authenticateJWT, authorizeRoles("ADMIN", "USER"), deleteProjectData);



// projectRoute.get("/:id", authenticateJWT, authorizeRoles( "USER", "ADMIN"), getProjectById);


projectRoute.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("USER", "ADMIN"),
  getProjectById
);





// ---------- top views project and top click project ------------------


projectRoute.get("/top", authenticateJWT, authorizeRoles("USER", "ADMIN"), getTopClickedProjectsController);

export default projectRoute;