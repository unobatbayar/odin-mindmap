"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-gradient text-white",
        outline:
          "border border-[var(--border-strong)] bg-[var(--panel-solid)]/80 text-zinc-700 shadow-sm hover:bg-black/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.04]",
        ghost:
          "bg-transparent text-zinc-600 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-zinc-100",
        secondary:
          "bg-accent text-accent-foreground hover:bg-accent/80",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        link: "text-[var(--accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-2.5 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-6",
        icon: "h-9 w-9 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
