// /app/api/units/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getUnitWithLessons, updateUnit, deleteUnit } from "@/services/unitService";
import { badRequest, forbidden, internalServerError } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);
        
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
        
        const { id } = await params;
        if (!id) return badRequest("Unit ID is required");
        await connectDB();
        const unitWithLessons = await getUnitWithLessons(user.id, id);
        return NextResponse.json({ success: true, data: unitWithLessons });
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
        
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
        
        const { id } = await params;
        if (!id) return badRequest("Unit ID is required");
        const data = await req.json();
        await connectDB();
        const updatedUnit = await updateUnit(user.id, id, data);
        return NextResponse.json({ success: true, data: updatedUnit });
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
        
        // Authorize based on role
        requireRole(user, ['admin', 'teacher']);
        
        const { id } = await params;
        if (!id) return badRequest("Unit ID is required");
        await connectDB();
        const deletedUnit = await deleteUnit(user.id, id);
        return NextResponse.json({ success: true, data: deletedUnit });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}
