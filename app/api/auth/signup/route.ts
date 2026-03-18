// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authenticateUser, registerUser } from "@/services/authService.node";
import { badRequest, internalServerError, conflict } from "@/utils/apiErrors";

function toDefaultUsername(email: string) {
    return email.trim().toLowerCase();
} // Simple username generator based on email

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json() as {
            email?: string;
            password?: string;
        };

        if (!email || !password) {
            return badRequest("Email and password are required");
        }

        const username = toDefaultUsername(email);
        const user = await registerUser(username, email, password);

        const token = await authenticateUser(email, password);

        if (!token) {
            return internalServerError('Unable to create session after registration');
        }

        const response = NextResponse.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
            },
        });

        response.cookies.set({
            name: "auth_token",
            value: token, 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000) {
            return conflict('A user with this email already exists');
        }

        return internalServerError();
    }
}