// /services/authService.edge.ts
import { jwtVerify } from "jose";

export interface AuthTokenPayload {
    id: string;
    role: 'admin' | 'teacher' | 'viewer';
    iat: number;
    exp: number;
}

function getSecret(): Uint8Array {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables')
    }
    return new TextEncoder().encode(jwtSecret);
}

function isAuthTokenPayload(payload: any): payload is AuthTokenPayload {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        typeof (payload as any).id === 'string' &&
        (
            (payload as any).role === 'admin' ||
            (payload as any).role === 'teacher' ||
            (payload as any).role === 'viewer'
        ) &&
        typeof (payload as any).iat === 'number' &&
        typeof (payload as any).exp === 'number'
    );
}

export async function verifyTokenEdge(token: string): Promise<AuthTokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());

        if (isAuthTokenPayload(payload)) {
            return payload;
        }
        
        return null;
    } catch (err) {
        return null;
    }
}

// Note: User registration and authentication functions are not implemented here.
// Edge runtimes do not support database operations or bcrypt hashing. 