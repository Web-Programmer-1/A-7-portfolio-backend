import express from "express";
import { loginUser, registerUser, totalUsers } from "./auth.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";


export const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login",  loginUser );
userRouter.get("/",authenticateJWT, authorizeRoles("ADMIN"), totalUsers);