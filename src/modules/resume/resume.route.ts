import express from "express";
import { createProfessionalResume, deleteResume, generateResumePDFController, getAllResume, updateResume } from "./resume.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";



const resumeRouter = express.Router();

resumeRouter.get("/",authenticateJWT, authorizeRoles( "ADMIN", "USER") , getAllResume);
resumeRouter.get("/pdf", authenticateJWT, authorizeRoles("USER", "ADMIN") , generateResumePDFController)
resumeRouter.post("/",authenticateJWT,   createProfessionalResume);
resumeRouter.put("/:id",  authenticateJWT, authorizeRoles("ADMIN", "USER"), updateResume);
resumeRouter.delete("/:id",deleteResume );






export default resumeRouter;