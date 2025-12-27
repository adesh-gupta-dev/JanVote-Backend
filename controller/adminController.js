import bcrypt from "bcryptjs";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import User from "../models/User.js";

const ALLOWED_ROLES = ["VOTER", "ADMIN", "CANDIDATE", "ELECTION_OFFICER"];

export const createUserByAdmin = asyncErrorHandler(async (req, res, next) => {
  // console.log(req);
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return next(
      new ErrorHandler("name, email, password, and role are required", 400)
    );
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return next(new ErrorHandler("Invalid role", 400));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

export const getAllUsersAdmin = asyncErrorHandler(async (_req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    success: true,
    users,
  });
});

export const updateUserRole = asyncErrorHandler(async (req, res, next) => {
  // console.log(req);
  const { id } = req.params;
  const { role } = req.body;
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return next(new ErrorHandler("Valid role is required", 400));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    user,
  });
});

export const deleteUserByAdmin = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.user && req.user._id.toString() === id.toString()) {
    return next(new ErrorHandler("Admins cannot delete themselves", 400));
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
