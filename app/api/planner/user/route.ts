// /app/api/planner/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getUserPlannerEntries } from "@/services/plannerService";
import { unauthorized, forbidden, internalServerError } from "@/utils/apiErrors";

export async function GET(req: NextRequest) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
    
        const plannerEntries = await getUserPlannerEntries(user.id);
        return NextResponse.json(plannerEntries);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}