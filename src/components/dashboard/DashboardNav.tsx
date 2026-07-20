"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

export function DashboardNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const roleLabel = user.role === "business" ? "Business" : "Artisan";

  const links = [
    { href: "/dashboard", label: "Overview", icon: "dashboard" },
    { href: "/dashboard/applications", label: "Applications", icon: "group" },
  ];

  if (user.role === "artisan") {
    links.push({ href: "/artisans", label: "My Public Profile", icon: "storefront" });
  }

  return (
    <aside className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card h-fit sticky top-24">
      <div className="mb-lg pb-lg border-b border-border-tan">
        <p className="font-label-caps text-label-caps text-primary uppercase mb-xs">{roleLabel} Hub</p>
        <p className="font-headline-sm text-headline-sm text-on-surface">{user.name}</p>
      </div>
      <nav className="space-y-xs">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-sm px-md py-sm rounded-lg font-body-sm text-body-sm transition-all",
              pathname === link.href
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
            )}
          >
            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
