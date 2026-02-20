// models/PlannerEntry.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a PlannerEntry document
export interface IPlannerEntry extends Document {
  user: mongoose.Types.ObjectId;
  lesson: mongoose.Types.ObjectId;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const plannerEntrySchema = new Schema<IPlannerEntry>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate scheduling
plannerEntrySchema.index(
  { user: 1, lesson: 1, date: 1 },
  { unique: true }
);

const PlannerEntry = mongoose.model<IPlannerEntry>("PlannerEntry", plannerEntrySchema);

export default PlannerEntry;
