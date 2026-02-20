// /services/unitLessonService.ts
import UnitLesson from "@/models/UnitLesson";
import Unit, { IUnit } from "@/models/Unit";
import Lesson from "@/models/Lesson";
import { forbidden, badRequest, notFound } from "@/utils/apiErrors";
import mongoose, { Types } from "mongoose";

export async function addLessonToUnit(
    unitId: string,
    lessonId: string,
    userId: string,
    order?: number
) {
    // Fetch unit first
    const unit = await Unit.findById(unitId);
    if (!unit) throw notFound("Unit not found");
    if (!unit.createdBy.equals(userId)) throw forbidden();

    // Fetch lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw notFound("Lesson not found");
    if (!lesson.createdBy.equals(userId)) throw forbidden();

    // Determine order if not provided
    if (order === undefined) {
        const last = await UnitLesson.find({ unit: unitId }).sort({ lessonOrder: -1 }).limit(1);
        order = last.length ? last[0].lessonOrder + 1 : 0;
    }

    // Add lesson to unit 
    try {
        const unitLesson = new UnitLesson({ unit: unitId, lesson: lessonId, lessonOrder: order });
        await unitLesson.save();
        return unitLesson.toJSON();
    } catch (err: any) {
        if (err.code === 11000) throw badRequest("Lesson already exists in a unit.");
        throw err;
    }
}

export async function removeLessonFromUnit(
    unitId: string, 
    lessonId: string,
    userId: string
) {
    // Find the UnitLesson and populate unit
    const unitLesson = await UnitLesson.findOne({ unit: unitId, lesson: lessonId })
        .populate<{unit: IUnit}>('unit'); // TypeScript know unitLesson.unit is IUnit
    
    if (!unitLesson) throw notFound("Lesson not found in unit");

    // Ownership check
    const unitDoc = unitLesson.unit as IUnit;
    if (!unitDoc.createdBy.equals(userId)) {
        throw forbidden("Cannot remove lesson from unit you do not own");
    }

    // Delete
    await unitLesson.deleteOne();
    return { message: "Lesson removed from unit"};
}

export async function reorderLesson(
    unitId: string,
    userId: string,
    lessonOrder: string[]
) {
    const unit = await Unit.findById(unitId);
    if (!unit) throw notFound("Unit not found");
    if (!unit.createdBy.equals(userId)) throw forbidden("Unit does not belong to you");

    // Fetch all UnitLesson documents for this unit
    const unitLessons = await UnitLesson.find({ unit: unitId });
    const lessonsMap = new Map(unitLessons.map(ul => [ul.lesson.toString(), ul]));

    // Validate all lessons exist
    if (lessonOrder.length !== unitLessons.length || !lessonOrder.every(id => lessonsMap.has(id))) {
        throw badRequest("Invalid lessonOrder array");
    }

    // Update order
    const bulkOps = lessonOrder.map((lessonId, index) => ({
        updateOne: {
            filter: { _id: lessonsMap.get(lessonId)?._id },
            update: { lessonOrder: index },
        },
    }));

    await UnitLesson.bulkWrite(bulkOps);

    return { message: "Lesson order updated" };
}

export async function getUnitLessons(unitId: string, userId: string) {
    const unit = await Unit.findById(unitId);
    if (!unit) throw notFound("Unit not found");
    if (!unit.createdBy.equals(userId)) throw forbidden("Unit does not belong to you");

    const lessons = await UnitLesson.find({ unit: unitId }).sort({ lessonOrder: 1 }).populate('lesson');

    return lessons.map(ul => ({
        id: ul._id,
        lesson: ul.lesson,
        lessonOrder: ul.lessonOrder,
    }));
}