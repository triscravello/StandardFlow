import { NextRequest, NextResponse } from "next/server";
import { addPlannerEntry, removePlannerEntry, reschedulePlannerEntry, getPlannerEntriesForWeek } from "@/services/plannerService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, badRequest, internalServerError } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

// Auth helper
async function authTeacherOrAdmin(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) throw new Error("UNAUTHORIZED");
  requireRole(user, ["admin", "teacher"]);
  return user;
}

// Convert Mongoose entry to client-safe object
function sanitizeEntry(entry: any) {
  return {
    _id: entry._id.toString(),
    lesson: {
      _id: entry.lesson._id.toString(),
      title: entry.lesson.title,
    },
    date: new Date(entry.date).toISOString(),
    user: entry.user?.toString(),
    createdAt: entry.createdAt ? new Date(entry.createdAt).toISOString() : undefined,
    updatedAt: entry.updatedAt ? new Date(entry.updatedAt).toISOString() : undefined,
  };
}

// GET /api/planner/week?startDate=...&endDate=...
export async function GET(req: NextRequest) {
  try {
    const user = await authTeacherOrAdmin(req);

    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");
    if (!startDateParam || !endDateParam) return badRequest("Missing startDate or endDate");

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return badRequest("Invalid startDate or endDate");

    await connectDB();
    const weeklyPlans = await getPlannerEntriesForWeek(user.id, startDate, endDate);

    return NextResponse.json({ entries: weeklyPlans.map(sanitizeEntry) });
  } catch (error: any) {
    switch (error.message) {
      case "FORBIDDEN":
        return forbidden();
      case "UNAUTHORIZED":
        return unauthorized();
      default:
        return internalServerError();
    }
  }
}

// POST /api/planner/week
// body: { lessonId, date }
export async function POST(req: NextRequest) {
  try {
    const user = await authTeacherOrAdmin(req);

    const { lessonId, date } = await req.json();
    if (!lessonId || !date) return badRequest("Missing lessonId or date");

    const lessonDate = new Date(date);
    if (isNaN(lessonDate.getTime())) return badRequest("Invalid date");

    await connectDB();
    const plannerEntry = await addPlannerEntry(user.id, lessonId, lessonDate);
    if (!plannerEntry.lesson?._id || !plannerEntry.lesson.title) {
      return badRequest("Invalid lesson reference for planner entry");
    }

    return NextResponse.json(sanitizeEntry(plannerEntry));
  } catch (error: any) {
    console.error("POST /api/planner/week failed:", error);
    switch (error.message) {
      case "FORBIDDEN":
        return forbidden();
      case "UNAUTHORIZED":
        return unauthorized();
      case "Lesson already scheduled for this user on the specified date":
        return badRequest(error.message);
      case "Planner entry not found after create":
        return badRequest(error.message);
      default:
        return internalServerError();
    }
  }
}

// DELETE /api/planner/week?entryId=...
export async function DELETE(req: NextRequest) {
  try {
    const user = await authTeacherOrAdmin(req);

    const url = new URL(req.url);
    const entryId = url.searchParams.get("entryId");
    if (!entryId) return badRequest("Missing entryId");

    await connectDB();
    await removePlannerEntry(entryId);

    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error: any) {
    switch (error.message) {
      case "FORBIDDEN":
        return forbidden();
      case "UNAUTHORIZED":
        return unauthorized();
      default:
        return internalServerError();
    }
  }
}

// PUT /api/planner/week
// body: { entryId, newDate }
export async function PUT(req: NextRequest) {
  try {
    const user = await authTeacherOrAdmin(req);

    const { entryId, newDate } = await req.json();
    if (!entryId || !newDate) return badRequest("Missing entryId or newDate");

    const dateObj = new Date(newDate);
    if (isNaN(dateObj.getTime())) return badRequest("Invalid newDate");

    await connectDB();
    const updatedEntry = await reschedulePlannerEntry(entryId, dateObj);
    if(!updatedEntry) return badRequest("Planner entry not found");
    if (!updatedEntry.lesson?._id || !updatedEntry.lesson.title) {
      return badRequest("Invalid lesson reference for planner entry");
    }

    return NextResponse.json(sanitizeEntry(updatedEntry));
  } catch (error: any) {
    console.error("PUT /api/planner/week failed:", error);
    switch (error.message) {
      case "FORBIDDEN":
        return forbidden();
      case "UNAUTHORIZED":
        return unauthorized();
      default:
        return internalServerError();
    }
  }
}