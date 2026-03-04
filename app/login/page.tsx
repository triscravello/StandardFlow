// /app/login/page.tsx
"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <LoginForm />
        </div>
    )
}