import {
  registerUser,
  loginUser,
  getuser,
  test,
  logoutUser,
  updateProfile,
  forgotPassword,
  resetPassword,
  sendVerificationOTP,
  verifyOtp,
} from "../controller/authController.js";
import {
  isAuthenticated,
  authorizedRoles,
} from "../middleware/authmiddleware.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", isAuthenticated, getuser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/test/:token", test);
router.put("/update-me", isAuthenticated, updateProfile);
router.post("/forgot/password", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/verify", isAuthenticated, sendVerificationOTP);
router.post("/verify/otp", isAuthenticated, verifyOtp);

export default router;
