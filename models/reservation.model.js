import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  reservedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "fulfilled"],
    default: "active",
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
