import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold uppercase tracking-[0.07em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-9 px-4 text-[11px]",
        size === "md" && "h-11 px-6 text-xs",
        size === "lg" && "h-12 px-8 text-[13px]",
        // Premium near-black that warms to burgundy on hover.
        variant === "primary" && "bg-ink text-canvas hover:bg-primary",
        variant === "secondary" && "bg-primary text-blush hover:bg-primary-800",
        variant === "accent" &&
          "bg-accent text-white shadow-sm hover:bg-accent-hover",
        variant === "subtle" && "bg-blush text-primary hover:bg-primary-100",
        variant === "ghost" &&
          "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-canvas",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
