// /app/api/units/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createUnitWithLessons, getUnitsByUser } from "@/services/unitService";
import { requireAuth, requireRole } from "@/lib/auth";
import { badRequest, forbidden, internalServerError, unauthorized } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

// POST new unit
export async function POST(req: NextRequest) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
    
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
        
        const data = await req.json();
        if (!data) return badRequest("Missing unit data");

        await connectDB();
        
        const newUnit = await createUnitWithLessons(user.id, data);
        return NextResponse.json(newUnit, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return unauthorized();
        }
        return internalServerError();
    }
}

// GET all units for the current user
export async function GET(req: NextRequest) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);

        // Authorize based on role
        requireRole(user, ['admin', 'teacher', 'viewer']);

        await connectDB();

        const allUnits = await getUnitsByUser(user.id);
        return NextResponse.json({ success: true, data: allUnits });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return unauthorized();
        }
        return internalServerError();
    }
}