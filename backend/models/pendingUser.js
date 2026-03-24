import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["customer", "tailor", "designer"],
    required: true,
  },
  profileData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

export default mongoose.model("PendingUser", pendingUserSchema);
