import mongoose from "mongoose";
// import { generateToken } from "../utils/generateToken.js";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["VOTER", "ADMIN", "CANDIDATE", "ELECTION_OFFICER"],
    default: "VOTER",
  },
  resetToken: {
    type: String,
    default: () => {
      null;
    },
  },
  resetTokenExpires: {
    type: Date,
    default: null,
  },
  otpHash: {
    type: String,
    default: () => {
      null;
    },
  },
  otpExpiresIn: {
    type: Date,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
