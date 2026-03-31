"use client";

import type { JSX, PropsWithChildren } from "react";
import { AuthProvider } from "../context/authContext";

export default function Providers({ children }: PropsWithChildren): JSX.Element {
    return <AuthProvider>{children}</AuthProvider>;
}