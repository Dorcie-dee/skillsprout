
import { Schema, model, Types } from "mongoose";
import normalize from 'normalize-mongoose'

const courseSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  difficultyLevel: { type: String, enum: ["Easy", "Intermediate", "Advanced"] },
  lessonId: { type: String },
  videoUrl: [{ type: String }],
  category: {
    type: String,
    enum: ['art', 'nature', 'language'],
    required: true
  },
  pictures: { type: [String] },
  quizId: { type: String },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  offlineActivityId: { type: String },
  quiz: [{ question: String, options: [String], answer: String }],
}, { timestamps: true });


courseSchema.plugin(normalize);
export const CourseModel = model('Courses', courseSchema);