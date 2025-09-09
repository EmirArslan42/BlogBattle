import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  blogs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  ],
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    },
  ],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  round: { type: Number, default: 1 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Match", matchSchema);
