import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  resendOTP,
  verifyUser,
} from "../controllers/user.controller.js";
import { rateLimitLoginAttempts } from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

userRouter.post("/add", createUser);
userRouter.post("/verify", verifyUser);
userRouter.post("/resend", resendOTP);
userRouter.post("/login", rateLimitLoginAttempts, loginUser);
userRouter.post("/logout", logoutUser);
export default userRouter;
