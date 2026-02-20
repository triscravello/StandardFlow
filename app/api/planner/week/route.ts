// /app/api/planner/week/route.ts
import { NextResponse, NextRequest } from "next/server";
import { removePlannerEntry, reschedulePlannerEntry, addPlannerEntry, getPlannerEntriesForWeek } from "@/services/plannerService";
import { requireAuth, requireRole } from "@/lib/auth";
import { unauthorized, forbidden, badRequest, internalServerError } from "@/utils/apiErrors";

async function authTeacherOrAdmin(req: NextRequest) {
    const user = await requireAuth(req);
    if (!user) throw new Error("UNAUTHORIZED");
    requireRole(user, ['admin', 'teacher']);
    return user;
}

export async function GET(req: NextRequest) {
    try{ 
        // Check auth + role
        const user = await authTeacherOrAdmin(req);

        // Parse query params
        const url = new URL(req.url);
        const startDateParam = url.searchParams.get('startDate');
        const endDateParam = url.searchParams.get('endDate');

        if (!startDateParam || !endDateParam) {
            return badRequest('Missing startDate or endDate query parameters');
        }

        const startDate = new Date(startDateParam);
        const endDate = new Date(endDateParam);

        // Check for invalid dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return badRequest("Invalid startDate or endDate");
        } 

        const weeklyPlans = await getPlannerEntriesForWeek(user.id, startDate, endDate);
        return NextResponse.json(weeklyPlans);
    } catch (error) {
        if (error instanceof Error) {
            switch(error.message) {
                case "FORBIDDEN": return forbidden();
                case "UNAUTHORIZED": return unauthorized();
                default: return internalServerError();
            }
        }
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // Authenticate the user
        const user = await authTeacherOrAdmin(req);

        const url = new URL(req.url);
        const lessonId = url.searchParams.get('lessonId');

        if (!lessonId) {
            return badRequest('Missing lessonId query parameter');
        }
    
        await removePlannerEntry(lessonId);
        return NextResponse.json({ message: 'Scheduled lesson canceled successfully' });
    } catch (error) {
        if (error instanceof Error) {
            switch(error.message) {
                case "FORBIDDEN": return forbidden();
                case "UNAUTHORIZED": return unauthorized();
                default: return internalServerError();
            }
        }
    }
}

export async function PUT(req: NextRequest) {
    try {
        const user = await authTeacherOrAdmin(req);

        const { entryId, newDate } = await req.json();

        if (!entryId || !newDate) {
            return badRequest('Missing entryId or newDate in request body');
        }

        // Check for invalid dates
        const newDateObj = new Date(newDate);
        if (isNaN(newDateObj.getTime())) return badRequest('Invalid newDate');
    
        const rescheduledEntry = await reschedulePlannerEntry(entryId, new Date(newDate));
        return NextResponse.json(rescheduledEntry);
    } catch (error) {
        if (error instanceof Error) {
            switch(error.message) {
                case "FORBIDDEN": return forbidden();
                case "UNAUTHORIZED": return unauthorized();
                default: return internalServerError();
            }
        }
    }
}

export async function POST(req: NextRequest) {
    try{
        const user = await authTeacherOrAdmin(req);
    
        const { lessonId, date } = await req.json();

        if (!lessonId || !date) {
            return badRequest('Missing lessonId or date in request body');
        }

        const lessonDate = new Date(date);
        if (isNaN(lessonDate.getTime())) return badRequest('Invalid lesson date');
    
        const plannerEntry = await addPlannerEntry(user.id, lessonId, lessonDate);
        return NextResponse.json(plannerEntry);
    } catch (error) {
        if (error instanceof Error) {
            switch(error.message) {
                case "FORBIDDEN": return forbidden();
                case "UNAUTHORIZED": return unauthorized();
                default: return internalServerError();
            }
        }
    }
}