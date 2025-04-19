import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      unique: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: 3,
      index: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      trim: true,
      minlength: 10,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: 3,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      max: 100,
    },
    available: {
      type: Boolean,
      required: [true, "Available is required"],
      default: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  {
    timestamps: true,
  }
);
bookSchema.index({ _id: 1, stock: 1 });
const Book = mongoose.model("Book", bookSchema);

export default Book;
