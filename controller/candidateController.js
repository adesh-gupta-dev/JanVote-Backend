import { log } from "console";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import mongoose from "mongoose";

// Add a candidate to an election
export const createCandidate = asyncErrorHandler(async (req, res, next) => {
  const { name, party, electionId } = req.body;

  if (!name || !electionId) {
    return next(new ErrorHandler("name and electionId are required", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(electionId)) {
    return next(new ErrorHandler("Invalid election ID", 400));
  }
  const election = await Election.findById(electionId);
  if (!election) {
    return next(new ErrorHandler("Election not found", 404));
  }

  const candidate = await Candidate.create({
    name,
    party,
    electionId,
  });

  res.status(201).json({
    success: true,
    candidate,
  });
});

// Get candidates (optionally filter by election)
export const getCandidates = asyncErrorHandler(async (req, res) => {
  const { electionId } = req.query;
  const query = electionId ? { electionId } : {};
  const candidates = await Candidate.find(query).populate(
    "electionId",
    "title status"
  );

  res.status(200).json({
    success: true,
    candidates,
  });
});

// Get single candidate
export const getCandidateById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const candidate = await Candidate.findById(id).populate(
    "electionId",
    "title status"
  );

  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404));
  }

  res.status(200).json({
    success: true,
    candidate,
  });
});

// Update candidate
export const updateCandidate = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, party } = req.body;

  const candidate = await Candidate.findByIdAndUpdate(
    id,
    { name, party },
    { new: true, runValidators: true }
  );

  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404));
  }

  res.status(200).json({
    success: true,
    candidate,
  });
});

// Delete candidate
export const deleteCandidate = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const candidate = await Candidate.findByIdAndDelete(id);

  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Candidate deleted successfully",
  });
});
