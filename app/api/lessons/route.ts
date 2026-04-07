// /app/api/lessons/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createLesson, getLessonByUser, getScheduledLessonsForUser } from "@/services/lessonService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, internalServerError, badRequest } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        console.log("Fetching lessons...");
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
            
        const data = await req.json();
        console.log("Incoming payload:", data);

        // validate required fields
        if (!data.title || !data.standardCode) {
            return badRequest("Missing required fields: title or standard code");
        }

        await connectDB();

        // Create lesson - note user.id is passed separately
        const newLesson = await createLesson(user.id, {
            title: data.title,
            standardCode: data.standardCode, // string code, e.g. "MA.912.DP.1.3"
            objectives: data.objectives,
            materials: data.materials,
        });

        return NextResponse.json(newLesson, { status: 201 });
    } catch (error) {
        console.error("POST /api/lessons error:", error);
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function GET(req: NextRequest) {
    try {
        console.log("Fetching lessons...");
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();
    
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
        
        const { searchParams } = new URL(req.url);
        const start = searchParams.get("start");
        const end = searchParams.get("end");

        if (!start && !end) {
            await connectDB();
            const lessons = await getLessonByUser(user.id);
            return NextResponse.json(lessons);
        }

        if (!start || !end) {
            return badRequest("start and end query parameters are required");
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return badRequest("Invalid date format");
        }

        await connectDB();
        const scheduledLessons = await getScheduledLessonsForUser(user.id, startDate, endDate);
        return NextResponse.json(scheduledLessons);
    } catch (error) {
        console.error("GET /api/lessons error:", error);
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}
