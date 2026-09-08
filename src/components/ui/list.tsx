import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/** Bordered list shell — solid surface so it reads against the canvas. */
const List = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--panel-solid)] shadow-surface",
      className,
    )}
    {...props}
  />
));
List.displayName = "List";

/** Divided body inside a List. Prefer this for scrollable feeds. */
const ListGroup = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("divide-y divide-[var(--separator)]", className)}
    {...props}
  />
));
ListGroup.displayName = "ListGroup";

const ListHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-b border-[var(--separator)] bg-[var(--muted-bg)] px-3.5 py-2.5",
      className,
    )}
    {...props}
  />
));
ListHeader.displayName = "ListHeader";

interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  active?: boolean;
  danger?: boolean;
}

/** Single row. Use `asChild` with `<a>` / `<button>` / `<Link>`. */
const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  ({ className, asChild = false, active = false, danger = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(
          "flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors",
          "hover:bg-black/[0.045] dark:hover:bg-white/[0.06]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]/30",
          active && "bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)]",
          danger &&
            "bg-red-50/70 hover:bg-red-50 dark:bg-red-950/30 dark:hover:bg-red-950/40",
          className,
        )}
        {...props}
      />
    );
  },
);
ListItem.displayName = "ListItem";

const ListItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
));
ListItemContent.displayName = "ListItemContent";

const ListItemTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "truncate text-sm font-medium text-zinc-800 dark:text-zinc-100",
      className,
    )}
    {...props}
  />
));
ListItemTitle.displayName = "ListItemTitle";

const ListItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-0.5 truncate text-xs text-[var(--muted)]", className)}
    {...props}
  />
));
ListItemDescription.displayName = "ListItemDescription";

const ListItemActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 items-center gap-2", className)}
    {...props}
  />
));
ListItemActions.displayName = "ListItemActions";

const ListEmpty = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "px-3.5 py-6 text-center text-sm text-[var(--muted)]",
      className,
    )}
    {...props}
  />
));
ListEmpty.displayName = "ListEmpty";

export {
  List,
  ListGroup,
  ListHeader,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemActions,
  ListEmpty,
};
