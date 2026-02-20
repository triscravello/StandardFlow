// models/Standard.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a Standard document
export interface IStandard extends Document {
  code: string;
  description: string;
  subject: string;
  gradeLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

const standardSchema = new Schema<IStandard>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    gradeLevel: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Helpful query index
standardSchema.index({ subject: 1, gradeLevel: 1 });

const Standard = mongoose.model<IStandard>("Standard", standardSchema);

export default Standard;