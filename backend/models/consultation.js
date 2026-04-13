import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    meetingLink: {
      type: String,
      default: "", // will be set when professional accepts
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Consultation", consultationSchema);
