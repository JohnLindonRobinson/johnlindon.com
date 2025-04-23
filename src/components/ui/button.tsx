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
            "h-12 px-8 py-2": size === "default",
            "h-14 px-10 py-3": size === "lg",
            "h-10 px-6 py-1": size === "sm",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
