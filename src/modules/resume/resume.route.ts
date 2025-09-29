import express from "express";
import { createProfessionalResume, deleteResume, generateResumePDFController, getAllResume, updateResume } from "./resume.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";


const resumeRouter = express.Router();

resumeRouter.get("/",authenticateJWT, authorizeRoles("USER", "ADMIN") , getAllResume);
resumeRouter.get("/pdf", authenticateJWT, authorizeRoles("USER", "ADMIN") , generateResumePDFController)
resumeRouter.post("/",authenticateJWT, authorizeRoles("USER", "ADMIN") ,createProfessionalResume);
resumeRouter.put("/:id",updateResume);
resumeRouter.delete("/:id",deleteResume );




export default resumeRouter;