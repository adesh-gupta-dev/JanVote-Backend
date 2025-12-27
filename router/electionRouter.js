import express from "express";
import {
  createElection,
  deleteElection,
  getElectionById,
  getElections,
  updateElection,
} from "../controller/electionController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  authorizedRoles("ADMIN", "ELECTION_OFFICER"),
  createElection
);
router.get("/", getElections);
router.get("/:id", getElectionById);
router.put(
  "/:id",
  isAuthenticated,
  authorizedRoles("ADMIN", "ELECTION_OFFICER"),
  updateElection
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizedRoles("ADMIN"),
  deleteElection
);

export default router;

