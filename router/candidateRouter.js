import express from "express";
import {
  createCandidate,
  deleteCandidate,
  getCandidateById,
  getCandidates,
  updateCandidate,
} from "../controller/candidateController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  authorizedRoles("ADMIN", "ELECTION_OFFICER"),
  createCandidate
);
router.get("/", getCandidates);
router.get("/:id", getCandidateById);
router.put(
  "/:id",
  isAuthenticated,
  authorizedRoles("ADMIN", "ELECTION_OFFICER"),
  updateCandidate
);
router.delete(
  "/:id",
  isAuthenticated,
  authorizedRoles("ADMIN", "ELECTION_OFFICER"),
  deleteCandidate
);

export default router;
