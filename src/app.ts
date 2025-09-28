
import compression from "compression";
import cors from "cors";
import express from "express";
import globalErrorHandler from "./utils/globalErrorHandeler";


const app = express();

app.use(cors({ origin: "*" }));   
app.use(compression());
app.use(express.json());



app.get("/", (_req, res) => {
  res.send("API is running");
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use(globalErrorHandler);

export default app;
