import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "verified" | "default" | "status";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    verified: "bg-secondary-container/30 text-on-secondary-container",
    default: "bg-surface-container text-on-surface-variant",
    status: "bg-tertiary-fixed text-on-tertiary-fixed",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs px-sm py-xs rounded-full font-label-caps text-label-caps uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <Badge variant="verified">
      <span className="material-symbols-outlined material-symbols-filled text-[14px]">
        verified
      </span>
      Verified
    </Badge>
  );
}
