// /lib/auth.ts
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtClaims {
    id: string;
    role: string;
}

export type TokenPayload = JwtClaims & jwt.JwtPayload;

export function generateToken(payload: JwtClaims): string {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1h',
        algorithm: 'HS256', // specify algorithm
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, SECRET_KEY, {
            algorithms: ['HS256']
        }) as TokenPayload;
    } catch (error) {
        return null;
    }
}

export type Role = 'admin' | 'teacher' | 'viewer';

export type AuthUser = {
    id: string;
    role: Role;
}

export async function requireAuth(req: NextRequest): Promise<AuthUser> {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
        throw new Error("UNAUTHORIZED")
    }

    const payload = verifyToken(token);
    if (!payload) {
        throw new Error("UNAUTHORIZED");
    }

    return { id: payload.id, role: payload.role as Role };
}

export function requireRole(
    user: AuthUser | null,
    allowed: Role[],
): void {
    if (!user || !allowed.includes(user.role)) {
        throw new Error('Unauthorized');
    }
}