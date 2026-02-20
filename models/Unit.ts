// models/Unit.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a Unit document
export interface IUnit extends mongoose.Document {
  name: string;
  gradeLevel?: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const unitSchema = new Schema<IUnit>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gradeLevel: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Helpful for filtering
unitSchema.index({ gradeLevel: 1 });

const Unit = mongoose.model<IUnit>("Unit", unitSchema);

export default Unit;
