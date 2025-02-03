import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(express.static("public"));

app.use(cookieParse());


//authentication
import authRoutes from "./routes/auth.route.js";
app.use("/api/auth", authRoutes);

//message routs
import messageRouts from "./routes/message.route.js";
app.use("/api/message", messageRouts);

//globally error handeling
import { globalErrorHandler } from "./controllers/error.controller.js";
app.use(globalErrorHandler)
export { app };
