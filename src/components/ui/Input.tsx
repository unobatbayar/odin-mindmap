import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--panel-solid)] px-3 py-2 text-sm text-zinc-900 shadow-sm transition-all duration-150 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
