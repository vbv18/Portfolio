import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-muted",
      "transition-colors duration-200 focus:border-ink dark:focus:border-accent resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
