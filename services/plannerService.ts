// services/plannerService.ts
import PlannerEntry from "../models/PlannerEntry";
import '../models/Lesson';
import type { ILesson } from "../models/Lesson";
import { Types } from "mongoose";

type PlannerEntryLean = {
  _id: Types.ObjectId;
  lesson: {
    _id: Types.ObjectId,
    title: string,
  };
  date: Date;
  user?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type returned to frontend after sanitization
export interface IPlannerEntryPopulated {
  _id: string;
  lesson: {
    _id: string;
    title: string;
  };
  date: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper: sanitize DB entry for frontend
function sanitizeEntry(entry: PlannerEntryLean): IPlannerEntryPopulated {
  return {
    _id: entry._id.toString(),
    lesson: {
      _id: entry.lesson._id.toString(),
      title: entry.lesson.title,
    },
    date: entry.date.toISOString(),
    createdAt: entry.createdAt?.toISOString(),
    updatedAt: entry.updatedAt?.toISOString(),
    user: entry.user?.toString(),
  };
}

// Fetch all planner entries for a user
export async function getUserPlannerEntries(
  userId: string
): Promise<IPlannerEntryPopulated[]> {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");

  const raw = await PlannerEntry.find({ user: new Types.ObjectId(userId) })
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean[]>();

  // Sanitize before returning
  return raw.map(sanitizeEntry);
}

// Fetch all planner entrues (admin use)
export async function getAllPlannerEntries(): Promise<IPlannerEntryPopulated[]> {
  const raw = await PlannerEntry.find()
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean[]>();

  return raw.map(sanitizeEntry);
}

// Add a planner entry
export async function addPlannerEntry(
  userId: string,
  lessonId: string,
  date: Date
): Promise<IPlannerEntryPopulated> {
  const entry = new PlannerEntry({
    user: new Types.ObjectId(userId),
    lesson: new Types.ObjectId(lessonId),
    date,
  });

  const saved = await entry.save().catch((err: unknown) => {
    if (
      typeof err === 'object' &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      throw new Error(
        "Lesson already scheduled for this user on the specified date"
      );
    }

    throw err;
  });

  const populated = await PlannerEntry.findById(saved._id)
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean | null>();
  
  if (!populated) {
    throw new Error("Planner entry not found after create");
  }

  return sanitizeEntry(populated);
}

// Remove planner entry
export async function removePlannerEntry(entryId: string): Promise<void> {
  await PlannerEntry.findByIdAndDelete(entryId).exec();
}

// Get planner entry by ID
export async function getPlannerEntryById(
  entryId: string
): Promise<IPlannerEntryPopulated | null> {
  const raw = await PlannerEntry.findById(entryId)
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean | null>();
  return raw ? sanitizeEntry(raw) : null;
}

// Reschedule planner entry
export async function reschedulePlannerEntry(
  entryId: string,
  newDate: Date
): Promise<IPlannerEntryPopulated | null> {
  const updated = await PlannerEntry.findByIdAndUpdate(
    entryId,
    { date: newDate },
    { new: true }
  )
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean | null>()
    .exec();

  return updated ? sanitizeEntry(updated) : null;
}

// Get lessons for a single day
export async function getLessonsScheduledOnDate(
  userId: string,
  date: Date
): Promise<IPlannerEntryPopulated[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const raw = await PlannerEntry.find({
    user: new Types.ObjectId(userId),
    date: { $gte: start, $lte: end },
  })
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean[]>();

  return raw.map(sanitizeEntry);
}

// Get entries for a week
export async function getPlannerEntriesForWeek(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<IPlannerEntryPopulated[]> {
  const raw = await PlannerEntry.find({
    user: new Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate },
  })
    .populate<{ lesson: ILesson }>("lesson", "title")
    .lean<PlannerEntryLean[]>();

  return raw.map(sanitizeEntry);
}

// Get lessons for a specific unit in a week
export async function getUnitLessonsForWeek(
  userId: string,
  unitId: string,
  startDate: Date,
  endDate: Date
): Promise<IPlannerEntryPopulated[]> {
  const raw = await PlannerEntry.find({
    user: new Types.ObjectId(userId),
    date: { $gte: startDate, $lte: endDate },
  })
    .populate<{ lesson: ILesson }>({
      path: "lesson",
      select: "title",
      match: { unit: new Types.ObjectId(unitId) },
    })
    .lean<PlannerEntryLean[]>();

  // Filter out entries where lesson didn't match
  return raw.filter((e) => e.lesson).map(sanitizeEntry);
}

// Clear all planner entries for a user
export async function clearUserPlanner(userId: string): Promise<void> {
  await PlannerEntry.deleteMany({ user: new Types.ObjectId(userId) }).exec();
}