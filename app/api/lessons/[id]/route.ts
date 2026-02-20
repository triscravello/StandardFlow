// /app/api/lessons/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getLessonById, scheduleLessonForUser, cancelScheduledLesson} from "@/services/lessonService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, internalServerError, badRequest } from "@/utils/apiErrors";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
    
        const { id } = params;
        const lesson = await getLessonById(user.id, params.id);
        return NextResponse.json(lesson);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
    
        const { id } = params;
        const data = await req.json();
    
        const scheduledLesson = await scheduleLessonForUser(user.id, id, new Date(data.date));
        return NextResponse.json(scheduledLesson);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const { id } = params;

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date");

        if (!dateParam) {
            return badRequest("date query parameter is required");
        }

        const date = new Date(dateParam);
        if (isNaN(date.getTime())) {
            return badRequest("Invalid date format");
        }

        await cancelScheduledLesson(user.id, params.id, date);
        return NextResponse.json({ message: 'Scheduled lesson canceled successfully' });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}