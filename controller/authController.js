import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendToken } from "../utils/generateToken.js";

import { sendEmail } from "../utils/sendEmail.js";
import { forgotEmailTemplate } from "../utils/forgotEmailTemplate.js";
import { generateResetPasswordToken } from "../utils/genrateResetPasswordToken.js";
import { otpVerificationEmailTemplate } from "../utils/otpVerificationEmailTemplate .js";

export const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;
  if (!name || !password || !email || !role) {
    return next(
      new ErrorHandler("Please provide name, password, email and role ", 400)
    );
  }
  if (role === "ADMIN") {
    return next(new ErrorHandler("you are not authorized ", 403));
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    password: hashedPassword,
    email,
    role,
  });
  res.status(201).json(user);
});
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, "token generated", res);
  // res.status(200).json({
  //   success: true,
  //   message: "Login successful",
  //   token,
  // });
});
export const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getuser = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    code: 200,
    user,
  });
});
export const getAllUser = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    message: "user loaded successfully",
    users,
  });
});
export const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  if (!name && !email) {
    return next(new ErrorHandler("NOTHING TO UPDATE", 404));
  }

  console.log(userId);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...(name && { name }),
      ...(email && { email }),
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  res.status(200).json({
    message: "user updated succssfully",
    updatedUser,
  });
});
export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // console.log(req);
  const { email, frontend_url } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide email"), 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("NO USER FOUND FROM GIVEN EMAIL"), 400);
  }
  const { hashedToken, resetPasswordTokenExpire, resetToken } =
    generateResetPasswordToken();
  await User.findOneAndUpdate(
    { email },
    {
      resetToken: hashedToken,
      resetTokenExpires: new Date(resetPasswordTokenExpire),
    },
    { new: true }
  );
  const resetUrl = `${
    frontend_url ? frontend_url : "https://localhost"
  }/password/reset/${resetToken}`;
  const message = forgotEmailTemplate(resetUrl);
  try {
    await sendEmail(user.email, "online-votion Password Recovery", message);

    res.status(200).json({
      status: "success",
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    await User.findOneAndUpdate(
      { email },
      {
        $unset: {
          resetToken: "",
          resetTokenExpires: "",
        },
      }
    );
  }
  // res.status(200).json({ messages: "check your email" });
});
export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({ resetToken: resetPasswordToken }).select(
    "+password"
  );
  if (!user) {
    return next(
      new ErrorHandler("Invalid or expired password reset token", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password do not match", 400)
    );
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const updateduser = await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  });
  sendToken(updateduser, 200, "Password reset successful", res);
});
export const sendVerificationOTP = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  const otp = crypto.randomInt(100000, 999999).toString();
  const hash = await bcrypt.hash(otp, 10);
  console.log(hash);
  const message = otpVerificationEmailTemplate(otp);
  if (user.verified) {
    return next("<h1>user is already verified<h1>", 400);
  }
  try {
    const userOtp = await User.findByIdAndUpdate(
      user._id,
      { otpHash: hash, otpExpiresIn: new Date(Date.now() + 10 * 60 * 1000) },
      { new: true }
    );

    if (!userOtp) {
      return next(new ErrorHandler("User not found", 404));
    }

    await sendEmail(user.email, "ONLINE VOTING VERIFICATION", message);

    // console.log(userOtp._id);
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Failed to send OTP", 400));
  }

  res.status(200).json({ message: "OTP sent successfully" });
});
export const verifyOtp = asyncErrorHandler(async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findById(req.user._id);

  if (
    !user ||
    !user.otpHash ||
    !user.otpExpiresIn ||
    Date.now() > user.otpExpiresIn.getTime()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  const match = await bcrypt.compare(otp, user.otpHash);
  if (!match) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  await User.findByIdAndUpdate(user._id, {
    verified: true,
    otpHash: null,
    otpExpiresIn: null,
  });
  res.status(200).json({ success: true });
});

export const test = asyncErrorHandler(async (req, res, next) => {
  console.log(req);
  res.status(301).json({
    success: true,
    message: "Auth route is working fine",
  });
});
