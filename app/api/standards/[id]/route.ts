// /app/api/standards/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getStandardById, deleteStandard, updateStandard } from "@/services/standardService";
import { badRequest, forbidden, internalServerError } from "@/utils/apiErrors";

// This API route handles GET requests to fetch a specific standard by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        const user = await requireAuth(req);

        // Authorize based on role
        requireRole(user, ["admin", "teacher", "viewer"]);

        const standard = await getStandardById(params.id);

        return NextResponse.json({ success: true, data: standard });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Autthenticate the user
        const user = await requireAuth(req);
        
        // Authorize based on role
        requireRole(user, ['admin']); // ADMIN ONLY
        
        const body = await req.json();
        const { code, description, subject, gradeLevel } = body;
        
        if (!code || !description || !subject || !gradeLevel == null) {
            return badRequest("code, description, subject, and gradeLevel are required")
        }
        
        const standard = await updateStandard(params.id, body);
        
        return NextResponse.json({ success: true, data: standard });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Autthenticate the user
        const user = await requireAuth(req);

        // Authorize based on role
        requireRole(user, ['admin']); // ADMIN ONLY
        
        await deleteStandard(params.id);
        
        return NextResponse.json(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error && error.message === "FORBIDDEN") {
            return forbidden();
        }
        return internalServerError();
    }
} // This API route handles DELETE requests to delete a standard
