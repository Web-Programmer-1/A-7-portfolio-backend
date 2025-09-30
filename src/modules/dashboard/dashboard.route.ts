import express from "express";
import { dashboardController, getTodayVisitorsController, getVisitorsController, getVisitorStatsController } from "./dashboard.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/authRole.middleware";

const dashRoute = express.Router();

dashRoute.get("/", authenticateJWT, authorizeRoles("ADMIN"), dashboardController)



// ---------------- Visitor Logger ------------------

dashRoute.get("/visitor", authenticateJWT, authorizeRoles("ADMIN"), getVisitorsController);

dashRoute.get("/stats", authenticateJWT, authorizeRoles("ADMIN"), getVisitorStatsController);

dashRoute.get("/today", authenticateJWT, authorizeRoles("ADMIN"), getTodayVisitorsController);





export default dashRoute;