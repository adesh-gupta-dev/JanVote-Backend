import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
});

// Prevent duplicate candidate names within the same election
candidateSchema.index({ electionId: 1, name: 1 }, { unique: true });

export default mongoose.model("Candidate", candidateSchema);
