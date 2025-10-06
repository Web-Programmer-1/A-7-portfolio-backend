
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import globalErrorHandler from "./utils/globalErrorHandeler";
import { userRouter } from "./modules/auth/auth.route";
import blogRouter from "./modules/blog/blog.route";
import resumeRouter from "./modules/resume/resume.route";
import projectRoute from "./modules/project/project.route";
import dashRoute from "./modules/dashboard/dashboard.route";
import { visitorLogger } from "./middleware/visitorLogger.middleware";
import path from "path";


const app = express();




app.use(
  cors({
    origin: ["http://localhost:3000", "https://asignment-7-client.vercel.app"],
    credentials: true,
  })
);


app.use(cookieParser())
app.use(compression());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


// user auth Route 
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/blog",blogRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/dashboard", dashRoute);
app.use(visitorLogger)


app.get("/", (_req, res) => {
  res.send("API is running");
});

app.get("/test-visitor", (req, res) => {
  res.json({ message: "Visitor logged successfully!" });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(globalErrorHandler);

export default app;
