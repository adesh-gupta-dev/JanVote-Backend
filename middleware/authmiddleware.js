import jwt from "jsonwebtoken";
import { asyncErrorHandler } from "./asyncErrorHandler.js";
import { ErrorHandler } from "./errorMiddleware.js";
import User from "../models/User.js";

export const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("Auth Middleware Token:", req.cookies);
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token.toString(), process.env.JWT_SECRET_KEY);
    // console.log(decoded.id);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }

  const user = await User.findById(decoded.id);
  // console.log(user);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
