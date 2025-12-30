import express from "express";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getAllUsersAdmin,
  getUser,
  updateUserRole,
} from "../controller/adminController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
  "/users",
  isAuthenticated,
  authorizedRoles("ADMIN"),
  createUserByAdmin
);

router.get(
  "/users",
  isAuthenticated,
  authorizedRoles("ADMIN"),
  getAllUsersAdmin
);

router.get("/user/:id", isAuthenticated, authorizedRoles("ADMIN"), getUser);

router.put(
  "/users/:id/role",
  isAuthenticated,
  authorizedRoles("ADMIN"),
  updateUserRole
);

router.delete(
  "/users/:id",
  isAuthenticated,
  authorizedRoles("ADMIN"),
  deleteUserByAdmin
);

export default router;
