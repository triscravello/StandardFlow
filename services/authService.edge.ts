// /services/authService.edge.ts
import { jwtVerify } from "jose";

export interface AuthTokenPayload {
    id: string;
    role: 'admin' | 'teacher' | 'viewer';
    iat: number;
    exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const secret = new TextEncoder().encode(JWT_SECRET);

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
        const { payload } = await jwtVerify(token, secret);

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