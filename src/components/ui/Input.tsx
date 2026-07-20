import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-xs">
      {label && (
        <label
          htmlFor={id}
          className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-md py-3 rounded-lg border border-border-tan bg-surface-white",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
          "text-body-sm font-body-sm placeholder:text-outline/50",
          error && "border-status-error",
          className
        )}
        {...props}
      />
      {error && <p className="text-status-error text-body-sm">{error}</p>}
    </div>
  );
}
