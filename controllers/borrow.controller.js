import mongoose from "mongoose";
import Book from "../models/book.model.js";
import Borrow from "../models/borrow.model.js";
import User from "../models/user.model.js";
import { EmailProvider } from "../services/email/EmailProvider.js";

const emailService = new EmailProvider();

export const borrowBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { bookId } = req.params;
      const userId = req.user?._id;

      if (!bookId) {
        return res.status(400).json({
          status: "error",
          message: "No book provided",
          errors: [{ field: "bookId", message: "No book provided" }],
        });
      }

      const existingBorrow = await Borrow.findOne({
        userId,
        bookId,
        returned: false,
      })
        .session(session)
        .lean();

      if (existingBorrow) {
        return res.status(400).json({
          status: "error",
          message: "You have already borrowed this book",
        });
      }

      const book = await Book.findByIdAndUpdate(
        bookId,
        { $inc: { stock: -1 } },
        {
          session,
          projection: { stock: 1, title: 1, author: 1, isbn: 1 },
          new: true,
        }
      );

      if (!book || book.stock < 0) {
        return res.status(400).json({
          status: "error",
          message: "Book is out of stock",
        });
      }

      const [borrow] = await Borrow.create(
        [
          {
            bookId,
            userId,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 12096e5),
            returned: false,
          },
        ],
        { session }
      );

      const user = await User.findById(userId).select("email").lean();

      res.status(200).json({
        status: "success",
        message: "Book borrowed successfully",
        data: borrow,
      });

      const formattedDueDate = borrow.dueDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedBorrowDate = borrow.borrowDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
      emailService
        .sendEmail(
          "borrowedBook",
          {
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            bookId: bookId,
            status: borrow.status,
            condition: borrow.condition,
            borrowDate: formattedBorrowDate,
            dueDate: formattedDueDate,
          },
          user.email
        )
        .catch((err) => {
          console.error("Email send error:", err);
        });
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while borrowing the book.",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const returnBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { borrowId } = req.params;
      const userId = req.user?._id;

      if (!borrowId) {
        return res.status(400).json({
          status: "error",
          message: "No borrow record provided",
          errors: [{ field: "borrowId", message: "No borrow record provided" }],
        });
      }

      const borrow = await Borrow.findOneAndUpdate(
        {
          _id: borrowId,
          userId,
          returned: false,
        },
        [
          {
            $set: {
              fineAmount: {
                $multiply: [
                  {
                    $cond: [
                      {
                        $gt: [
                          {
                            $dateDiff: {
                              startDate: "$dueDate",
                              endDate: "$$NOW",
                              unit: "day",
                            },
                          },
                          0,
                        ],
                      },
                      {
                        $dateDiff: {
                          startDate: "$dueDate",
                          endDate: "$$NOW",
                          unit: "day",
                        },
                      },
                      0,
                    ],
                  },
                  5,
                ],
              },
              status: "returned",
              returnDate: "$$NOW",
              dueDate: null,
              returned: true,
            },
          },
        ],
        {
          new: true,
          session,
          projection: { bookId: 1, fineAmount: 1, returnDate: 1 },
        }
      );

      if (!borrow) {
        return res.status(400).json({
          status: "error",
          message: "Borrow record not found or already returned",
        });
      }

      await Book.findByIdAndUpdate(
        borrow.bookId,
        { $inc: { stock: 1 } },
        { session }
      );

      res.status(200).json({
        status: "success",
        message: "Book returned successfully",
        data: borrow,
      });
    });
  } catch (error) {
    console.error("Error returning book:", error);
    next(error);
  } finally {
    session.endSession();
  }
};
