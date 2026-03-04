// /app/signup/page.tsx
"use client";

import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <SignupForm />
        </div>
    )
}