import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
    default: "UPCOMING",
  },
});

export default mongoose.model("Election", electionSchema);


