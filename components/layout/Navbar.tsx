// /components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Units", href: "/units" },
  { name: "Lessons", href: "/lessons" },
  { name: "Standards", href: "/standards" },
  { name: "Weekly Plans", href: "/weekly-plans" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white px-6 py-4">
      <ul className="flex space-x-6">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "hover:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}