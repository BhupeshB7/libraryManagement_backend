import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
    condition: {
      type: String,
      required: true,
      enum: ["good", "bad"],
      default: "good",
    },
    fineAmount: {
      type: Number,
    },
    returned: {
      type: Boolean,
      default: false,
    },
    returnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
