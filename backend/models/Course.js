import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  weeks: { type: Number, required: true },
  courseStructure: { type: Array, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Course", courseSchema);
