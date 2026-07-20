import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98]",
    secondary: "bg-secondary text-on-secondary hover:bg-secondary-container active:scale-[0.98]",
    outline: "border-2 border-border-tan text-primary hover:bg-surface-container-low",
    ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-low",
  };

  const sizes = {
    sm: "px-md py-sm text-label-caps font-label-caps rounded-lg",
    md: "px-lg py-sm text-headline-sm font-headline-sm rounded-lg",
    lg: "px-xl py-md text-headline-sm font-headline-sm rounded-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-sm transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
