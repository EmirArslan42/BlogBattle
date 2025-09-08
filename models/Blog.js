import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: "Genel" },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  image:{type:String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Blog", BlogSchema);
