import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-white rounded-xl border border-border-tan p-lg shadow-card",
        hover && "bento-card cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
