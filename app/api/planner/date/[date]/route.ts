// app/api/planner/date/[date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, badRequest, forbidden, internalServerError } from "@/utils/apiErrors";
import { getLessonsScheduledOnDate } from "@/services/plannerService";

export async function GET(
    req: NextRequest,
    { params }: { params: { date: string } }
) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const date = new Date(params.date);
        if (isNaN(date.getTime())) {
            return badRequest('Invalid date format');
        }

        const lessonsOnDate = await getLessonsScheduledOnDate(user.id, date);
        return NextResponse.json(lessonsOnDate);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}