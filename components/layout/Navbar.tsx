"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Dashboard / Planner", href: "/planner/week" },
  { name: "Units", href: "/units" },
  { name: "Lessons", href: "/lessons" },
  { name: "Standards", href: "/standards" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }

    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <ul className="flex flex-wrap items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors ${
                    isActive ? "text-yellow-400 font-semibold" : "hover:text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          {user && (
            <p className="text-sm text-gray-300">
              {user.username} <span className="text-gray-400">({user.role})</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-gray-500 px-3 py-1 text-sm font-medium hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}