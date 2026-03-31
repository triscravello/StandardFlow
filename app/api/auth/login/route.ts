// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authenticateUser } from "@/services/authService.node";
import { User } from "@/models/Users";
import { badRequest, unauthorized, internalServerError } from "@/utils/apiErrors";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { username, password } = await request.json() as {
            username?: string;
            password?: string;
        };

        if (!username || !password) {
            return badRequest("Username/email and password are required");
        }

        const token = await authenticateUser(username, password);

        if (!token) {
            return unauthorized("Invalid username or password");
        }

        const user = await User.findOne({
            $or: [{ username }, { email: username }],
        }).select('email username role').lean();

        const response = NextResponse.json({
            success: true,
            data: {
                token,
                user: {
                    id: user?._id.toString() || '',
                    email: user?.email || '',
                    username: user?.username || '',
                    role: user?.role || '',
                },
            }
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
    } catch (error) {
        if (error instanceof Error && error.message === "Invalid username or password") {
            return unauthorized(error.message);
        }
        return internalServerError();
    }
}