import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getPlannerEntryById } from "@/services/plannerService";
import { unauthorized, badRequest, forbidden, internalServerError } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

// Sanitize a single planner entry
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate
    const user = await requireAuth(req);
    if (!user) return unauthorized();

    // Authorize
    requireRole(user, ["admin", "teacher"]);

    const { id } = await params;
    const entryId = id;
    if (!entryId) return badRequest("Missing entry id");

    await connectDB();
    const plannerEntry = await getPlannerEntryById(entryId);
    if (!plannerEntry) return badRequest("Planner entry not found");

    return NextResponse.json(sanitizeEntry(plannerEntry));
  } catch (error: any) {
    if (error.message === "FORBIDDEN") return forbidden();
    return internalServerError();
  }
}