// /app/api/lessons/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getLessonById, updateLesson, deleteLesson} from "@/services/lessonService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, internalServerError, badRequest } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
    
        const { id } = await params;
        await connectDB();
        const lesson = await getLessonById(user.id, id);
        return NextResponse.json(lesson);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
    
        const { id } = await params;
        const data = await req.json();

        await connectDB();
        const updatedLesson = await updateLesson(user.id, id, data);
        return NextResponse.json(updatedLesson);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const { id } = await params;

        if (!id) return badRequest("Lesson id is required");
        await connectDB();
        await deleteLesson(user.id, id);
        return NextResponse.json({ message: 'Lesson deleted successfully.' });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}