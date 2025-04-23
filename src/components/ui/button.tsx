'use client';

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "lg" | "sm";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-manrope font-extrabold transition-colors",
          {
            "bg-primary text-white hover:bg-primary/90": variant === "primary",
            "text-black hover:text-primary": variant === "secondary",
            "h-12 px-6 text-base": size === "default",
            "h-16 px-8 text-lg": size === "lg",
            "h-9 px-4 text-sm": size === "sm",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
