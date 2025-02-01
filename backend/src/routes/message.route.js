import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getMessages,
  getUserForSidebar,
  sendMessages,
} from "../controllers/message.controller.js";

const router = Router();

router.get("/users", verifyJWT, getUserForSidebar);

router.get("/:id", verifyJWT, getMessages);

router.post("/send/:id", verifyJWT, sendMessages);
export default router;
