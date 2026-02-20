// /services/unitService.ts
import Unit, { IUnit } from '../models/Unit';
import Lesson, { ILesson } from '../models/Lesson';
import UnitLesson, { IUnitLesson } from '../models/UnitLesson';
import { getUnitLessons } from './unitLessonService';
import { forbidden } from '@/utils/apiErrors';

export interface IUnitLessonPopulated 
    extends Omit<IUnitLesson, 'lesson'> {
        lesson: ILesson;
}

export interface UnitData {
    name: string;
    gradeLevel?: number;
    startDate: Date;
    endDate: Date;
    lessons: {
        lessonId: string;
        lessonOrder: number;
    }[],
}

type UpdateUnitData = Omit<Partial<UnitData>, "lessons">;

export async function createUnitWithLessons(userId: string, unitData: UnitData): Promise<IUnit> {
    const session = await Unit.startSession();
    session.startTransaction();

    try {
        const unit = new Unit({
            name: unitData.name,
            gradeLevel: unitData.gradeLevel,
            startDate: unitData.startDate,
            endDate: unitData.endDate,
            createdBy: userId,
        });

        await unit.save({ session });

        if (unitData.lessons.length) {
            await UnitLesson.insertMany(
                unitData.lessons.map(l => ({
                    unit: unit._id,
                    lesson: l.lessonId,
                    lessonOrder: l.lessonOrder,
                    createdBy: userId,
                })),
                { session }
            );
        };

        await session.commitTransaction();
        return unit;
    } catch (error) {
        await session.abortTransaction();
        throw new Error('Error creating unit with lessons: ' + error);
    } finally {
        session.endSession();
    }
}

export async function getUnitWithLessons(
    userId: string, 
    unitId: string
) { 
    const unit = await Unit.findOne({
        _id: unitId,
        createdBy: userId,
    }).lean();

    if (!unit) throw new Error("NOT_FOUND");

    const lessons = await getUnitLessons(userId, unitId);

    return { 
        unit,
        lessons,
    };
} 

export async function addLessonToUnit(userId: string, unitId: string, lessonId: string, lessonOrder: number): Promise<IUnitLesson> {
    // Ensure unit ownership
    const unitExists = await Unit.exists({ _id: unitId, createdBy: userId });
    if (!unitExists) throw new Error('Unit not found');

    return await UnitLesson.create({
        unit: unitId,
        lesson: lessonId,
        lessonOrder,
        createdBy: userId,
    });
}

export async function removeLessonFromUnit(userId: string, unitId: string, lessonId: string): Promise<IUnitLesson | null> {
    try {
        const deletedUnitLesson = await UnitLesson.findOneAndDelete({ unit: unitId, lesson: lessonId, createdBy: userId }).lean();
        if (!deletedUnitLesson) throw new Error('UnitLesson not found for deletion');
        return deletedUnitLesson;
    } catch (error) {
        throw new Error('Error removing lesson from unit: ' + error);
    }
}

export async function updateUnit(userId: string, unitId: string, data: UpdateUnitData): Promise<IUnit | null> {
    try {
        const updatedUnit = await Unit.findByIdAndUpdate({ _id: unitId, createdBy: userId }, data, { new: true }).lean();
        if (!updatedUnit) throw new Error('Unit not found for update');
        return updatedUnit;
    } catch (error) {
        throw new Error('Error updating unit: ' + error);
    }
}

export async function deleteUnit(userId: string, unitId: string): Promise<IUnit | null> {
    const deletedUnit = await Unit.findOneAndDelete({ _id: unitId, createdBy: userId }).lean();
    if (!deletedUnit) throw Error("NOT_FOUND");
    await UnitLesson.deleteMany({ unit: unitId, createdBy: userId });
    return deletedUnit;
}

export async function getUnitsByUser(userId: string): Promise<IUnit[]> {
    return Unit.find({ createdBy: userId })
        .sort({ startDate: 1 })
        .lean();
}