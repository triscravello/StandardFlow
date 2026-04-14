// /app/api/planner/week/unit/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, badRequest, internalServerError } from "@/utils/apiErrors";
import { getUnitLessonsForWeek } from "@/services/plannerService";
import { connectDB } from "@/lib/mongodb";

async function authTeacherOrAdmin(req: NextRequest) {
    const user = await requireAuth(req);
    if (!user) throw new Error("UNAUTHORIZED");
    requireRole(user, ['admin', 'teacher']);
    return user;
}

function handleRouteError(error: unknown) {
    if (error instanceof Error) {
        switch(error.message) {
            case "FORBIDDEN": return forbidden();
            case "UNAUTHORIZED": return unauthorized();
            default: return internalServerError();
        }
    }
    return internalServerError();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authTeacherOrAdmin(req);
        const { id: unitId } = await params;
        
        if (!unitId) return badRequest("Missing unitId");

        const url = new URL(req.url);
        const startDateParam = url.searchParams.get("startDate");
        const endDateParam = url.searchParams.get("endDate");

        if (!startDateParam || !endDateParam) return badRequest("Missing startDate or endDate query parameters");

        const startDate = new Date(startDateParam);
        const endDate = new Date(endDateParam);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return badRequest("Invalid startDate or endDate");

        await connectDB();
        const unitLessons = await getUnitLessonsForWeek(user.id, unitId, startDate, endDate);
        return NextResponse.json(unitLessons);
    } catch (error) {
        return handleRouteError(error);
    }
}