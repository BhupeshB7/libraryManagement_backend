import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      minlength: 3,
      unique: true,
      index: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "user"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otpHash: String,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);
// TTL index for automatic cleanup (expires after 2 minutes)
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
