// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './services/authService.edge';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const payload = verifyTokenEdge(token);

    if (!payload) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/protected/:path*'],
}

// This middleware protects routes under /protected/*
// It checks for a valid JWT in the Authorization header
// If valid, it allows access and appends userId and role as query parameters
// If invalid or missing, it redirects to /login