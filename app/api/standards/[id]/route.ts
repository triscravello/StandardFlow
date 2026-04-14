// /app/api/standards/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getStandardById, deleteStandard, updateStandard } from "@/services/standardService";
import { badRequest, forbidden, internalServerError } from "@/utils/apiErrors";
import dbConnect from "@/lib/db";

// This API route handles GET requests to fetch a specific standard by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);

        // Authorize based on role
        requireRole(user, ["admin", "teacher", "viewer"]);
        const { id } = await params;

        await dbConnect();

        const standard = await getStandardById(id);

        return NextResponse.json({ success: true, data: standard });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Autthenticate the user
        const user = await requireAuth(req);
        
        // Authorize based on role
        requireRole(user, ['admin']); // ADMIN ONLY
        const { id } = await params;
        
        const body = await req.json();
        const { code, description, subject, gradeLevel } = body;
        
        if (!code || !description || !subject || gradeLevel == null) {
            return badRequest("code, description, subject, and gradeLevel are required")
        }

        await dbConnect();
        
        const standard = await updateStandard(id, body);
        
        return NextResponse.json({ success: true, data: standard });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Autthenticate the user
        const user = await requireAuth(req);

        // Authorize based on role
        requireRole(user, ['admin']); // ADMIN ONLY
        const { id } = await params;

        await dbConnect();
        
        await deleteStandard(id);
        
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
} // This API route handles DELETE requests to delete a standard
