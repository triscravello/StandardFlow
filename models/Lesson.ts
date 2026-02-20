// models/Lesson.ts
import mongoose, { Schema, Document, Model, trusted } from "mongoose";

// Interface for a Lesson document
export interface ILesson extends mongoose.Document {
  title: string;
  standard: mongoose.Types.ObjectId;
  objectives: string[];
  materials: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    standard: {
      type: Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
    },
    objectives: {
      type: [String],
      default: [],
    },
    materials: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }
  },
  { timestamps: true }
);

// Helpful index
lessonSchema.index({ standard: 1 });

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;
