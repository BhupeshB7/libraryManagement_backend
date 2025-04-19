import mongoose from "mongoose";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const sessionId = req.signedCookies.lms_sessionId;
  if (!sessionId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
      errors: [{ field: "sessionId", message: "Unauthorized" }],
    });
  }
  const session = await Session.findById(sessionId).lean();
  if (!session) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
      errors: [{ field: "sessionId", message: "Unauthorized" }],
    });
  }
  const user = await User.findById(session.userId).lean();
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
      errors: [{ field: "sessionId", message: "Unauthorized" }],
    });
  }
  req.user = user;
  next();
};
