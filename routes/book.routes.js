import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { addBook, getAllBooks, getBookById, updateBookById, deleteBookById } from "../controllers/book.controller.js";

const bookRouter = express.Router();

bookRouter.post("/add", upload.single("image"), addBook);
bookRouter.get("/get-all", getAllBooks);
bookRouter.get("/get-by-id/:id", getBookById);
bookRouter.patch("/:id", updateBookById);
bookRouter.delete("/:id", deleteBookById);

export default bookRouter;
