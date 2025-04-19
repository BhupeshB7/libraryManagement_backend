import Book from "../models/book.model.js";
import { bookZodSchema } from "../zodSchemas/book.zod.js";
import fs from "fs";
export const addBook = async (req, res, next) => {
  try {
    const convertedBody = {
      ...req.body,
      stock: Number(req.body.stock),
      available: JSON.parse(req.body.available),
    };
 
    const parsed = bookZodSchema.parse(convertedBody);
     if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
        errors: [{ field: "img", message: "No file uploaded" }],
      });
    }

    const book = new Book({
      ...parsed, 
      image: req.file.filename,
    });

    await book.save();

    return res.status(200).json({
      status: "success",
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    console.log(req.file.path);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    next(error);
  }
};

// get all books

export const getAllBooks = async (req, res, next) => {
  console.log("API Called!");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sorting = req.query.sorting || "-createdAt";

    const totalBooks = await Book.countDocuments().exec();
    const totalPages = Math.ceil(totalBooks / limit);

    const allBooks = await Book.find()
      .sort(sorting)
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: "success",
      message: "Books retrieved successfully",
      data: allBooks,
      pagination: {
        page,
        limit,
        totalPages,
        total: totalBooks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get book by id

export const getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res.status(400).json({
        status: "error",
        message: "Book not found",
        errors: [{ field: "id", message: "Book not found" }],
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// update book by id
export const updateBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const allowedFields = [
      "title",
      "author",
      "isbn",
      "category",
      "stock",
      "available",
    ];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid fields provided for update",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedBook) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

// delete book by id

export const deleteBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res.status(400).json({
        status: "error",
        message: "Book not found",
        errors: [{ field: "id", message: "Book not found" }],
      });
    }
    await Book.deleteOne({ _id: book._id });
    return res.status(200).json({
      status: "success",
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
