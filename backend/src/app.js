import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);


app.use(express.static("public"));

app.use(cookieParse());

//authentication
import authRoutes from "./routes/auth.route.js"
app.use("/api/auth",authRoutes)
export { app };
