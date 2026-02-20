// /app/api/standards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getStandards, createStandard } from "@/services/standardService";
import {
  forbidden,
  badRequest,
  internalServerError,
} from "@/utils/apiErrors";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    requireRole(user, ["admin", "teacher", "viewer"]);

    const standards = await getStandards();
    return NextResponse.json({ success: true, data: standards });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbidden();
    }
    return internalServerError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    requireRole(user, ["admin"]); // ADMIN ONLY

    const body = await req.json();
    const { code, description, subject, gradeLevel } = body;

    if (!code || !description || !subject || !gradeLevel) {
      return badRequest("Code, description, subject, and gradeLevel are required");
    }

    const standard = await createStandard(body);

    return NextResponse.json(
      { success: true, data: standard },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return forbidden();
    }
    return internalServerError();
  }
}
