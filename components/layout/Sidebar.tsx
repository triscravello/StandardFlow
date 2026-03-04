// /components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { name: "Home", href: "/" },
  { name: "Units", href: "/units" },
  { name: "Lessons", href: "/lessons" },
  { name: "Standards", href: "/standards" },
  { name: "Weekly Plans", href: "/weekly-plans" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-100 w-64 min-h-screen p-6 border-r">
      <nav>
        <ul className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-200 font-semibold text-gray-900"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}