'use client';

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl shadow-lg transition-all duration-300",
          {
            "bg-white dark:bg-gray-800": variant === "primary",
            "bg-gray-50 dark:bg-gray-900": variant === "secondary",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export default Card; 