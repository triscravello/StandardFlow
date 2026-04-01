// /components/auth/SignupForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return;
        }
        setIsSubmitting(true);

        try {
            await authService.signup({ email, password });
            setSuccessMessage("Account created successfully. Redirecting...")
            router.push("/planner/week");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Signup failed. Please try again";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-emerald-600 mb-4">{successMessage}</p>}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                </button>
            </div>
        </form>
    )
}