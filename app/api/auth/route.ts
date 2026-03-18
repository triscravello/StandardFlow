// /app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateToken, JwtClaims } from "../../../lib/auth";
import { badRequest } from "@/utils/apiErrors";

export async function POST(req: NextRequest) {
    const { id, role } = await req.json() as JwtClaims;

    if (!id || !role) {
        return badRequest("ID and Role are required");
    }

    const token = generateToken({ id, role });

    const response = NextResponse.json({ token });

    // Set token in HttpOnly cookie
    response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', 
        path: '/',
    })

    return response;
}

export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
}