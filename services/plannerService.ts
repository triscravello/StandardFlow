// services/plannerService.ts
import PlannerEntry, { IPlannerEntry } from '../models/PlannerEntry';
import Lesson, { ILesson } from '../models/Lesson';
import { Types } from 'mongoose';

export interface IPlannerEntryPopulated extends Omit<IPlannerEntry, 'lesson'> {
    lesson: ILesson;
}

export async function getUserPlannerEntries(
    userId: string
): Promise<IPlannerEntryPopulated[]> {
    try {
        return await PlannerEntry.find({ user: new Types.ObjectId(userId) })
            .populate<{ lesson: ILesson }>('lesson')
            .lean<IPlannerEntryPopulated[]>();
    } catch (error) {
        throw new Error('Error retrieving planner entries: ' + error);
    }
}

export async function removePlannerEntry(
    entryId: string
): Promise<void> {
    try {
        await PlannerEntry.findByIdAndDelete(entryId).exec();
    } catch (error) {
        throw new Error('Error removing planner entry: ' + error);
    }
}

export async function getPlannerEntryById(
    entryId: string
): Promise<IPlannerEntryPopulated | null> {
    try {
        return await PlannerEntry.findById(entryId)
            .populate<{ lesson: ILesson }>('lesson')
            .lean<IPlannerEntryPopulated | null>();
    } catch (error) {
        throw new Error('Error retrieving planner entry by ID: ' + error);
    }
}

export async function reschedulePlannerEntry(
    entryId: string,
    newDate: Date
): Promise<IPlannerEntry | null> {
    try {
        return await PlannerEntry.findByIdAndUpdate(
            entryId,
            { date: newDate },
            { new: true }
        ).lean();
    } catch (error) {
        throw new Error('Error rescheduling planner entry: ' + error);
    }
}

export async function getLessonsScheduledOnDate(
    userId: string,
    date: Date
): Promise<IPlannerEntryPopulated[]> {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await PlannerEntry.find({
            user: new Types.ObjectId(userId),
            date: { $gte: startOfDay, $lte: endOfDay },
        })
        .populate<{ lesson: ILesson }>('lesson')
        .lean<IPlannerEntryPopulated[]>();
    } catch (error) {
        throw new Error('Error retrieving lessons scheduled on date: ' + error);
    }
}

export async function addPlannerEntry(
    userId: string,
    lessonId: string,
    date: Date
): Promise<IPlannerEntry> {
    try {
        const plannerEntry = new PlannerEntry({
            user: new Types.ObjectId(userId),
            lesson: new Types.ObjectId(lessonId),
            date,
        });
        return await plannerEntry.save();
    } catch (error) {
        if (
            error instanceof Error &&
            (error as any).code === 11000 // Duplicate key error
        ) {
            throw new Error('Lesson already scheduled for this user on the specified date');
        }
        throw new Error('Error adding planner entry: ' + error);
    }
}

export async function getAllPlannerEntries(): Promise<IPlannerEntryPopulated[]> {
    try {
        return await PlannerEntry.find()
            .populate<{ lesson: ILesson }>('lesson')
            .lean<IPlannerEntryPopulated[]>();
    } catch (error) {
        throw new Error('Error retrieving all planner entries: ' + error);
    }
}

export async function clearUserPlanner(
    userId: string
): Promise<void> {
    try {
        await PlannerEntry.deleteMany({ user: new Types.ObjectId(userId) }).exec();
    } catch (error) {
        throw new Error('Error clearing user planner: ' + error);
    }
}

export async function getPlannerEntriesForWeek(
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<IPlannerEntryPopulated[]> {
    if (!Types.ObjectId.isValid(userId)) throw new Error('Invalid userId');
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) throw new Error('Invalid start date');
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) throw new Error('Invalid end date');

    return await PlannerEntry.find({
        user: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
    })
        .populate<{ lesson: ILesson }>('lesson')
        .lean<IPlannerEntryPopulated[]>();
}

export async function getUnitLessonsForWeek(
    userId: string,
    unitId: string,
    startDate: Date,
    endDate: Date
): Promise<IPlannerEntryPopulated[]> {
    if (!Types.ObjectId.isValid(userId)) throw new Error('Invalid userId');
    if (!Types.ObjectId.isValid(unitId)) throw new Error('Invalid unitId');
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) throw new Error('Invalid start date');
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) throw new Error('Invalid end date');

    return await PlannerEntry.find({
        user: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
    })
        .populate<{ lesson: ILesson }>({
            path: "lesson",
            match: { unit: new Types.ObjectId(unitId) }, // Only lessons in this requested unit
        })
        .lean<IPlannerEntryPopulated[]>()
        .then(entries => entries.filter(e => e.lesson)); // Remove entries where lessons didn't match
}