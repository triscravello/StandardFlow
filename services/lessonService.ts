// /services/lessonService.ts
import Lesson, { ILesson } from '../models/Lesson';
import PlannerEntry, { IPlannerEntry } from '../models/PlannerEntry';
import { Types } from 'mongoose';

export interface IPlannerEntryPopulated
  extends Omit<IPlannerEntry, 'lesson'> {
  lesson: ILesson;
}

export interface LessonData {
    title: string;
    standardId: string;
    objectives?: string[];
    materials?: string[];
}

export async function createLesson(userId: string, lessonData: LessonData): Promise<ILesson> {
    try {
        const lesson = new Lesson({
            title: lessonData.title, 
            standard: lessonData.standardId,
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
    } catch (error: any) {
        if (error?.code === 11000) {
            throw new Error('Lesson already scheduled for this date');
        }
        throw error;
    }
}

export async function getScheduledLessonsForUser(
    userId: string,
    startDate: Date,
    endDate: Date,
): Promise<IPlannerEntryPopulated[]> {
    try {
        return await PlannerEntry.find({
            user: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
        })
        .populate<{ lesson: ILesson }>({
            path: 'lesson',
            match: { createdBy: userId },
        })
        .lean<IPlannerEntryPopulated[]>();
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
        const updatedLesson = await Lesson.findOneAndUpdate(
            { _id: lessonId, createdBy: userId },
            {
                ...(data.title && { title: data.title }),
                ...(data.standardId && { standard: data.standardId }), 
                ...(data.objectives && { objectives: data.objectives }),
                ...(data.materials && { materials: data.materials }),
            }, 
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
