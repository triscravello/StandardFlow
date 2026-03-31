import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Providers from "@/app/providers";
import "@/styles/globals.css";
import "@/styles/planner.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StandardFlow",
    template: "%s | StandardFlow",
  },
  description: "StandardFlow is a lesson planning platform for educators to organize units, lessons, and standards, and weekly plans in one structured workflow.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("auth_token"));
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <Providers>
        <div className="flex flex-col h-screen">
          {isLoggedIn && <Navbar />}
          <div className="flex flex-1 overflow-hidden">
            {isLoggedIn && <Sidebar />}
            <main className="flex-1 p-6 overflow-y-auto bg-white">{children}</main>
          </div>
        </div>
        </Providers>
      </body>
    </html>
  );
}
