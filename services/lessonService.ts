// /services/lessonService.ts
import Lesson, { ILesson } from '../models/Lesson';
import PlannerEntry, { IPlannerEntry } from '../models/PlannerEntry';
import { Types } from 'mongoose';
import Standard from '@/models/Standard';

export interface IPlannerEntryPopulated extends Omit<IPlannerEntry, 'lesson'> {
  lesson: ILesson;
}

export interface LessonData {
    title: string;
    standardCode: string; // <-- frontend sends the code string
    objectives?: string[];
    materials?: string[];
}

export interface LessonDTO {
    _id: string;
    title: string;
    standard: string;
    standardCode: string;
    objectives?: string[];
    materials?: string[];
}

type LessonWithStandardLean = {
    _id: Types.ObjectId;
    title: string;
    standard: {
        _id: Types.ObjectId;
        code: string;
    };
    objectives?: string[];
    materials?: string[];
};

type ScheduledLessonEntry = {
    [key: string]: unknown;
    lesson: {
        [key: string]: unknown;
        standard: unknown;
        standardCode?: unknown;
    };
}

export async function createLesson(userId: string, lessonData: LessonData): Promise<ILesson> {
    try {
        // lookup Standard by code
        const standard = await Standard.findOne({ code: lessonData.standardCode });
        if (!standard) {
            throw new Error(`Standard with code ${lessonData.standardCode} not found`);
        }

        const lesson = new Lesson({
            title: lessonData.title, 
            standard: standard._id, // <-- store ObjectId
            objectives: lessonData.objectives || [],
            materials: lessonData.materials || [],
            createdBy: userId,
        });

        return await lesson.save();
    } catch (error) {
        throw new Error('Error creating lesson: ' + error);
    }
}

export async function getLessonById(userId: string, lessonId: string): Promise<ILesson | null> {
    try {
        const lesson = await Lesson.findOne({
            _id: lessonId,
            createdBy: userId,
        }).lean();

        if (!lesson) throw new Error('Lesson not found');
        return lesson;
    } catch (error) {
        throw new Error('Error retrieving lesson by ID: ' + error);
    }
}

export async function getLessonByUser(userId: string): Promise<LessonDTO[]> {
    try {
        const lessons = await Lesson.find({ createdBy: userId })
            .populate<{ standard: { code: string } }>({
                path: 'standard',
                select: 'code', // only fetch the code field
            })
            .sort({ createdAt: -1 })
            .lean<LessonWithStandardLean[]>();
        return lessons.map((lesson) => ({
            _id: lesson._id.toString(),
            title: lesson.title,
            standard: lesson.standard._id.toString(),
            standardCode: lesson.standard.code,
            objectives: lesson.objectives,
            materials: lesson.materials,
        }))
    } catch (error) {
        throw new Error('Error retrieving lessons: ' + error);
    }
}

export async function scheduleLessonForUser(
    userId: string,
    lessonId: string,
    date: Date
): Promise<IPlannerEntry> {
    // Ensure lesson belongs to user
    const lessonExists = await Lesson.exists({
        _id: lessonId,
        createdBy: userId
    });

    if (!lessonExists) {
        throw new Error('Lesson not found');
    }

    try {
        return await PlannerEntry.create({
            user: new Types.ObjectId(userId),
            lesson: new Types.ObjectId(lessonId),
            date,
        });
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000) {
            throw new Error('Lesson already scheduled for this date');
        }
        throw error;
    }
}

export async function getScheduledLessonsForUser(
    userId: string,
    startDate: Date,
    endDate: Date,
): Promise<ScheduledLessonEntry[]> {
    try {
        const scheduled = await PlannerEntry.find({
            user: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
        })
        .populate<{ lesson: ILesson & { standard: { code: string } } }>({
            path: 'lesson',
            match: { createdBy: userId },
            populate: { path: 'standard', select: 'code' },
        })
        .lean<ScheduledLessonEntry[]>();

        // Add standardCode to each lesson
        return scheduled.map(entry => ({
            ...entry,
            lesson: {
                ...entry.lesson,
                standardCode: entry.lesson.standard,
            }
        }));
    } catch (error) {
        throw new Error('Error retrieving scheduled lessons for user: ' + error);
    }
}

export async function cancelScheduledLesson(
    userId: string,
    lessonId: string,
    date: Date
): Promise<IPlannerEntry | null> {
    try {
        const deletedEntry = await PlannerEntry.findOneAndDelete({
            user: new Types.ObjectId(userId),
            lesson: new Types.ObjectId(lessonId),
            date,
        }).lean();
        if (!deletedEntry) throw new Error('Scheduled lesson not found for cancellation');
        return deletedEntry;
    } catch (error) {
        throw new Error('Error cancelling scheduled lesson: ' + error);
    }
}

export async function updateLesson(
    userId: string,
    lessonId: string,
    data: Partial<LessonData>
): Promise<ILesson | null> {
    try {
        const update: any = {};
        if (data.title) update.title = data.title;
        if (data.standardCode) {
            const standard = await Standard.findOne({ code: data.standardCode });
            if (!standard) throw new Error(`Standard with code ${data.standardCode} not found`);
            update.standard = standard._id;
        }
        if (data.objectives) update.objectives = data.objectives;
        if (data.materials) update.materials = data.materials;
        const updatedLesson = await Lesson.findOneAndUpdate(
            { _id: lessonId, createdBy: userId },
            update,
            { new: true }
        ).lean();
        
        if (!updatedLesson) throw new Error('Lesson not found for update');
        return updatedLesson;
    } catch (error) {
        throw new Error('Error updating lesson: ' + error);
    }
}

export async function deleteLesson(userId: string, lessonId: string): Promise<ILesson | null> {
    try {
        const deletedLesson = await Lesson.findOneAndDelete({
            _id: lessonId, 
            createdBy: userId
        }).lean();
        
        if (!deletedLesson) throw new Error('Lesson not found for deletion');
        
        await PlannerEntry.deleteMany({ 
            lesson: new Types.ObjectId(lessonId),
            user: new Types.ObjectId(userId),
        });
        
        return deletedLesson;
    } catch (error) {
        throw new Error('Error deleting lesson: ' + error);
    }
}
