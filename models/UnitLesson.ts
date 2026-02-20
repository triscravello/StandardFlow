// models/UnitLesson.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IUnit } from "./Unit";

// Interface for a UnitLesson document
export interface IUnitLesson extends mongoose.Document {
    unit: mongoose.Types.ObjectId;
    lesson: mongoose.Types.ObjectId;
    lessonOrder: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
}

const unitLessonSchema = new Schema<IUnitLesson>(
    {
        unit: {
            type: Schema.Types.ObjectId,
            ref: "Unit",
            required: true,
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: "Lesson", 
            required: true,
        },
        lessonOrder: {
            type: Number,
            required: true,
            min: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
);

// Ensure a lesson is not added multiple times to the same unit
unitLessonSchema.index(
    { unit: 1, lesson: 1 },
    { unique: true }
);

// Helpful for ordering lessons within a unit
unitLessonSchema.index({ unit: 1, lessonOrder: 1 });

const UnitLesson = mongoose.model<IUnitLesson>("UnitLesson", unitLessonSchema);

export default UnitLesson;