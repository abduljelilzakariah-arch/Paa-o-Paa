"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  artisanId: string;
  initialSaved?: boolean;
  size?: "sm" | "md";
}

export function SaveButton({ artisanId, initialSaved = false, size = "md" }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch("/api/customer/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save artisan"}
      className={cn(
        "rounded-full flex items-center justify-center transition-colors",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
        saved
          ? "bg-primary text-on-primary"
          : "bg-surface-white/90 text-on-surface-variant hover:text-primary border border-border-tan"
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined",
          saved && "material-symbols-filled",
          size === "sm" ? "text-[18px]" : "text-[22px]"
        )}
      >
        bookmark
      </span>
    </button>
  );
}
