// /app/api/units/[id]/lessons/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addLessonToUnit, getUnitLessons, reorderLesson, removeLessonFromUnit } from "@/services/unitLessonService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, internalServerError } from "@/utils/apiErrors";

// Helper for DRY error handling
function handleApiError(error: unknown) {
    if (error instanceof Error && error.message === "FORBIDDEN") return forbidden();
    console.error(error);
    return internalServerError();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        //Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const { id } = await params;
        const unitLessons = await getUnitLessons(id, user.id);
        return NextResponse.json({ success: true, data: unitLessons });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        //Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const { id } = await params;
        const { lessonId, lessonOrder } = (await req.json()) as { lessonId: string; lessonOrder: number };

        if (!lessonId) return NextResponse.json({ error: "lessonId is required" });

        const unitLesson = await addLessonToUnit(id, lessonId, user.id, lessonOrder);
        return NextResponse.json({ success: true, data: unitLesson });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        //Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const { id } = await params;
        const { lessonId } = (await req.json()) as { lessonId: string };

        if (!lessonId) return NextResponse.json({ error: "lessonId is required" });

        const result = await removeLessonFromUnit(id, lessonId, user.id);
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        //Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const { id } = await params;
        const { lessonOrder } = (await req.json()) as { lessonOrder: string[] };

        if (!lessonOrder || !Array.isArray(lessonOrder)) {
            return NextResponse.json({ error: "lessonOrder array is required" }, { status: 400 })
        }

        const result = await reorderLesson(id, user.id, lessonOrder);
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
            // Authenticate the user
            const user = await requireAuth(req);
            if (!user) return unauthorized();
            
            // Authorize based on role
            requireRole(user, ['admin', 'teacher']);
            
            const { id } = await params;
            const data = await req.json();
            const { action, lessonId, lessonOrder } = data;
            
            let result;
            if (action === "addLesson") {
                result = await addLessonToUnit(id, lessonId, user.id, lessonOrder);
            } else if (action === "removeLesson") {
                result = await removeLessonFromUnit(id, lessonId, user.id);
            } else if (action === 'reorderLesson') {
                result = await reorderLesson(id, user.id, lessonOrder);
            } else {
                return NextResponse.json({ error: "Invalid action" }, { status: 400 })
            }

            return NextResponse.json({ success: true, data: result });
        } catch (error) {
            return handleApiError(error);
        }
}