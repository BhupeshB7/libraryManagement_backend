import express from "express";
import { borrowBook, returnBook } from "../controllers/borrow.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
const borrowRouter = express.Router();

borrowRouter.post("/:bookId", authMiddleware, borrowBook);
borrowRouter.post("/return/:borrowId",authMiddleware, returnBook);

export default borrowRouter;
