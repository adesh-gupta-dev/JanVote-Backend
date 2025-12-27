import express from "express";
import {
  castVote,
  getMyVote,
  getVotesForElection,
} from "../controller/voteController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, authorizedRoles("VOTER"), castVote);
router.get(
  "/election/:electionId",
  isAuthenticated,
  authorizedRoles("ADMIN", "ELECTION_OFFICER"),
  getVotesForElection
);
router.get("/me/:electionId", isAuthenticated, getMyVote);

export default router;

