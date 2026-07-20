"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

interface NavbarProps {
  user?: SessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isProvider = user?.role === "artisan" || user?.role === "business";
  const isCustomer = user?.role === "user";

  const links = [
    ...(isCustomer ? [{ href: "/explore", label: "Explore" }] : []),
    { href: "/artisans", label: "Near Me" },
    { href: "/apprenticeships", label: "Apprenticeships" },
    ...(isProvider
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : [{ href: "/register?role=artisan", label: "Join as Artisan" }]),
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const profileHref = isProvider ? "/dashboard" : user ? (isCustomer ? "/explore" : "/profile") : "/login";

  return (
    <>
      <header className="bg-background sticky top-0 z-50 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-container-max mx-auto">
          <Link href="/" className="text-headline-md font-headline-md font-extrabold text-primary">
            Paa O Paa!
          </Link>

          <div className="hidden md:flex items-center gap-xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-label-caps text-label-caps transition-colors pb-1",
                  pathname.startsWith(link.href.split("?")[0])
                    ? "text-primary border-b-2 border-primary font-bold"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-md">
            {user ? (
              <>
                <Link
                  href={profileHref}
                  className="hidden sm:flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {isProvider ? "dashboard" : "person"}
                  </span>
                  <span className="font-body-sm text-body-sm">{user.name}</span>
                </Link>
                {isProvider && (
                  <Link href="/dashboard/applications" className="hidden sm:block">
                    <Button size="sm" variant="secondary">
                      Applications
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
            <button
              className="md:hidden material-symbols-outlined p-sm"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? "close" : "menu"}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-border-tan px-margin-mobile py-md space-y-sm bg-background">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-sm font-label-caps text-label-caps text-on-surface-variant"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 backdrop-blur-xl border border-border-tan shadow-elevated rounded-full">
        {[
          { href: "/", icon: "home", label: "Home" },
          ...(isCustomer ? [{ href: "/explore", icon: "explore", label: "Explore" }] : []),
          { href: "/artisans", icon: "near_me", label: "Near Me" },
          { href: isProvider ? "/dashboard" : "/apprenticeships", icon: isProvider ? "dashboard" : "school", label: isProvider ? "Dashboard" : "Learn" },
          { href: profileHref, icon: "person", label: "Account" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[44px]",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "text-primary"
                : "text-on-surface-variant/60"
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined",
                (pathname === item.href || pathname.startsWith(item.href + "/")) &&
                  "material-symbols-filled"
              )}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
