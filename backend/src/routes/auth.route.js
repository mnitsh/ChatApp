import { Router } from "express";
import {
  logout,
  login,
  signup,
  updateProfilePic,
  updatefullname,
  changeCurrentPassword,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/signup", upload.single("profilePic"), signup);

router.post("/login", login);

router.post("/logout", logout);

router.patch(
  "/updateDP",
  verifyJWT,
  upload.single("profilePic"),
  updateProfilePic
);

router.patch("/fullname", verifyJWT, updatefullname);

router.patch("/changePassword", verifyJWT, changeCurrentPassword);

router.route("/currentUser").get(verifyJWT, getCurrentUser);

export default router;
