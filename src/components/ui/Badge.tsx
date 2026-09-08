import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  color?: string;
}

/** Soft wash + colored label - closer to Apple status chips than solid pills */
function softBadgeColors(hex?: string): React.CSSProperties {
  const c = hex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) ? hex : "#86868b";
  return {
    backgroundColor: `color-mix(in srgb, ${c} 16%, transparent)`,
    color: c,
    boxShadow: `inset 0 0 0 0.5px color-mix(in srgb, ${c} 32%, transparent)`,
  };
}

function Badge({
  label,
  color,
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-[9rem] shrink-0 items-center truncate rounded-[6px] px-1.5 py-0.5 text-[10px] font-semibold tracking-tight",
        className,
      )}
      style={{ ...softBadgeColors(color), ...style }}
      {...props}
    >
      {children ?? label}
    </span>
  );
}

export { Badge };
