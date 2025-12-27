import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import Election from "../models/Election.js";

// Create a new election (Admin or Election Officer)
export const createElection = asyncErrorHandler(async (req, res, next) => {
  const { title, description, startTime, endTime, status } = req.body;

  if (!title || !startTime || !endTime) {
    return next(
      new ErrorHandler("title, startTime and endTime are required", 400)
    );
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return next(new ErrorHandler("startTime must be before endTime", 400));
  }

  const election = await Election.create({
    title,
    description,
    startTime,
    endTime,
    status,
  });

  res.status(201).json({
    success: true,
    election,
  });
});

// Get all elections (public)
export const getElections = asyncErrorHandler(async (_req, res) => {
  const elections = await Election.find().sort({ startTime: 1 });
  res.status(200).json({
    success: true,
    elections,
  });
});

// Get single election
export const getElectionById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const election = await Election.findById(id);

  if (!election) {
    return next(new ErrorHandler("Election not found", 404));
  }

  res.status(200).json({
    success: true,
    election,
  });
});

// Update election
export const updateElection = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, startTime, endTime, status } = req.body;

  if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
    return next(new ErrorHandler("startTime must be before endTime", 400));
  }

  const election = await Election.findByIdAndUpdate(
    id,
    { title, description, startTime, endTime, status },
    { new: true, runValidators: true }
  );

  if (!election) {
    return next(new ErrorHandler("Election not found", 404));
  }

  res.status(200).json({
    success: true,
    election,
  });
});

// Delete election
export const deleteElection = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const election = await Election.findByIdAndDelete(id);

  if (!election) {
    return next(new ErrorHandler("Election not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Election deleted successfully",
  });
});
