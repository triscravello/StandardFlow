// /app/api/lessons/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createLesson, getScheduledLessonsForUser } from "@/services/lessonService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, internalServerError, badRequest } from "@/utils/apiErrors";

export async function POST(req: NextRequest) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
            
        const data = await req.json();
        const newLesson = await createLesson(user.id, data);
        return NextResponse.json(newLesson, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function GET(req: NextRequest) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();
    
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
        
        const { searchParams } = new URL(req.url);
        const start = searchParams.get("start");
        const end = searchParams.get("end");

        if (!start || !end) {
            return badRequest("start and end query parameters are required");
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return badRequest("Invalid date format");
        }
    
        const scheduledLessons = await getScheduledLessonsForUser(user.id, startDate, endDate);
        return NextResponse.json(scheduledLessons);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}
