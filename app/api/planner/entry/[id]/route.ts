// /app/api/planner/entry/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getPlannerEntryById } from "@/services/plannerService";
import { unauthorized, badRequest, forbidden, internalServerError } from "@/utils/apiErrors";

export async function GET(
    req: NextRequest, 
    { params }: { params: { id: string } }
) {
    try{
        // Authenticate the user
        const user = await requireAuth(req);
        if (!user) return unauthorized();

        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);

        const entryId = params.id;

        if (!entryId) {
            return badRequest('Missing entry id');
        }

        const plannerEntry = await getPlannerEntryById(entryId);
        return NextResponse.json(plannerEntry);
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}