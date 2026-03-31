import { NextRequest, NextResponse } from "next/server";
import { generateToken, JwtClaims, verifyToken } from "../../../lib/auth";
import { badRequest, internalServerError } from "@/utils/apiErrors";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/Users";

export async function POST(req: NextRequest) {
    const { id, role } = (await req.json()) as JwtClaims;

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
    try {
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false, user: null });
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ authenticated: false, user: null });
        }

        await connectDB();

        const user = await User.findById(payload.id).select("email username role").lean<{ _id: { toString: () => string }; email: string; username: string; role: 'admin' | 'teacher' | 'viewer' }>();

        if (!user) {
            return NextResponse.json({ authenticated: false, user: null });
        }

        return NextResponse.json({ 
            authenticated: true,
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });
    } catch {
        return internalServerError();
    }
}