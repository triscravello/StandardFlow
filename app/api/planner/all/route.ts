// /app/api/planner/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getAllPlannerEntries, clearUserPlanner } from "@/services/plannerService";
import { unauthorized, forbidden, internalServerError } from "@/utils/apiErrors";

export async function GET(req: NextRequest) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin']);

        const allEntries = await getAllPlannerEntries();
        return NextResponse.json(allEntries);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function DELETE(req: NextRequest) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin']);
    
        await clearUserPlanner(user.id);
        return NextResponse.json({ message: 'All planner entries cleared successfully' });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}