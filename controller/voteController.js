import crypto from "crypto";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";

// Cast a vote (VOTER)
export const castVote = asyncErrorHandler(async (req, res, next) => {
  const { electionId, candidateId } = req.body;
  const userId = req.user._id;

  // Require verified users to vote
  if (!req.user.verified) {
    return next(
      new ErrorHandler(
        "Account not verified. Please verify before voting.",
        403
      )
    );
  }

  // Basic ObjectId validation to avoid cast errors
  const idsAreValid =
    electionId && candidateId && Election.isValidObjectId
      ? Election.isValidObjectId(electionId) &&
        Election.isValidObjectId(candidateId)
      : true;
  if (!idsAreValid) {
    return next(new ErrorHandler("Invalid electionId or candidateId", 400));
  }

  if (!electionId || !candidateId) {
    return next(
      new ErrorHandler("electionId and candidateId are required", 400)
    );
  }

  const election = await Election.findById(electionId);
  if (!election) {
    return next(new ErrorHandler("Election not found", 404));
  }

  if (election.status !== "ACTIVE") {
    return next(
      new ErrorHandler("Voting is only allowed for ACTIVE elections", 400)
    );
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404));
  }

  if (candidate.electionId.toString() !== electionId.toString()) {
    return next(
      new ErrorHandler("Candidate does not belong to this election", 400)
    );
  }

  const existingVote = await Vote.findOne({ electionId, userId });
  if (existingVote) {
    return next(
      new ErrorHandler("User has already voted in this election", 400)
    );
  }

  const voteHash = crypto
    .createHash("sha256")
    .update(`${userId.toString()}:${electionId.toString()}`)
    .digest("hex");

  const vote = await Vote.create({
    electionId,
    candidateId,
    userId,
    voteHash,
  });

  res.status(201).json({
    success: true,
    vote,
  });
});

// Get all votes for an election (Admin / Election Officer)
export const getVotesForElection = asyncErrorHandler(async (req, res, next) => {
  const { electionId } = req.params;
  const election = await Election.findById(electionId);

  if (!election) {
    return next(new ErrorHandler("Election not found", 404));
  }

  const votes = await Vote.find({ electionId })
    .populate("candidateId", "name party")
    .populate("userId", "email role");

  res.status(200).json({
    success: true,
    votes,
  });
});

// Get the logged-in user's vote for an election
export const getMyVote = asyncErrorHandler(async (req, res, next) => {
  const { electionId } = req.params;
  const userId = req.user._id;

  const vote = await Vote.findOne({ electionId, userId }).populate(
    "candidateId",
    "name party"
  );

  if (!vote) {
    return next(new ErrorHandler("No vote found for this election", 404));
  }

  res.status(200).json({
    success: true,
    vote,
  });
});
