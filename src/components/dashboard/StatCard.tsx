import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  accent?: "primary" | "secondary" | "tertiary" | "warning";
  className?: string;
}

const accents = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary-container/40 text-on-secondary-container",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
  warning: "bg-secondary-container text-on-secondary-container",
};

export function StatCard({ label, value, icon, accent = "primary", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-white rounded-xl border border-border-tan p-lg shadow-card flex flex-col gap-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("w-11 h-11 rounded-xl flex items-center justify-center", accents[accent])}>
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        <span className="font-display text-display-mobile md:text-[32px] text-on-surface leading-none">
          {value}
        </span>
      </div>
      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
