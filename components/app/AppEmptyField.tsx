"use client";

import { cn } from "@/lib/utils";

interface AppEmptyFieldProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AppEmptyField({
  className,
  size = "md",
}: AppEmptyFieldProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-muted-foreground/70",
        sizeClasses[size],
        className
      )}
    >
      <span className="italic">Not provided</span>
    </div>
  );
}
