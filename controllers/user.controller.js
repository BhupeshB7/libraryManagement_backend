import { userZodSchema } from "../zodSchemas/user.zod.js";
import User from "../models/user.model.js";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { generateOTP, hashOTP, verifyOTP } from "../services/otp.service.js";
import { EmailProvider } from "../services/email/EmailProvider.js";
import bcrypt from "bcrypt";
import Session from "../models/session.model.js";
const emailService = new EmailProvider();
export const createUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const parsed = userZodSchema.parse(req.body);
    const { email } = parsed;

    const existingVerifiedUser = await User.findOne({ email })
      .select("email")
      .session(session);

    if (existingVerifiedUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
        errors: [{ field: "email", message: "Email already exists" }],
      });
    }

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    if (parsed.password) {
      const salt = await bcrypt.genSalt(10);
      parsed.password = await bcrypt.hash(parsed.password, salt);
    }
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          ...parsed,
          otpHash,
          verified: false,
          expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        },
      },
      { upsert: true, session }
    ); 
    emailService.sendEmail("otp", {otp}, email).catch((err) => {
      console.error("Email send error:", err);
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      status: "success",
      message: "OTP sent to email",
      data: { email, expiresAt: new Date(Date.now() + 2 * 60 * 1000) },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
        errors: [{ field: "email", message: "User not found" }],
      });
    }
    if (user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Account already verified",
        errors: [{ field: "email", message: "Account already verified" }],
      });
    }
    const isValid = await verifyOTP(otp, user.otpHash);
    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
        errors: [{ field: "otp", message: "Invalid OTP" }],
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { verified: true } },
      { new: true, session }
    ).exec();
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      status: "success",
      message: "Account verified successfully",
      data: updatedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, verified: false }).session(
      session
    );
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "No pending verification found",
        errors: [{ field: "email", message: "No pending verification found" }],
      });
    }
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    await User.updateOne(
      { _id: user._id },
      { $set: { otpHash, expiresAt: new Date(Date.now() + 2 * 60 * 1000) } }
    ).session(session);
    await session.commitTransaction();
    session.endSession();
    // Send OTP to user
    await emailService.sendOTP(email, otp);

    return res.status(200).json({
      status: "success",
      message: "OTP sent to email",
      data: { email, expiresAt: new Date(Date.now() + 2 * 60 * 1000) },
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

//login user

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
        errors: [{ field: "email", message: "User not found" }],
      });
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
        errors: [{ field: "password", message: "Invalid password" }],
      });
    }

    const allSessions = await Session.find({ userId: user._id }).lean();
    if (allSessions.length >= 3) {
      await allSessions[0].deleteOne();
    }
    const session = await Session.create({ userId: user._id });
    await session.save();
    res.cookie("lms_sessionId", session.id, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      signed: true,
    });
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//logout user

export const logoutUser = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies.lms_sessionId;
    console.log("logout", sessionId);
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({
        status: "error",
        message: "Session not found",
        errors: [{ field: "sessionId", message: "Session not found" }],
      });
    }
    await Session.deleteOne();
    res.clearCookie("lms_sessionId");
    return res.status(200).json({
      status: "success",
      message: "Logout successful",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
