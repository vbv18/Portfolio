import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-sm border border-border bg-surface px-3.5 text-sm text-ink placeholder:text-muted",
      "transition-colors duration-200 focus:border-ink dark:focus:border-accent",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
