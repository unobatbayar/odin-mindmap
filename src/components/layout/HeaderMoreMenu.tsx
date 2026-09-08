"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface HeaderMoreItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick: () => void;
  active?: boolean;
}

function IconMore() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" />
    </svg>
  );
}

/** Overflow menu for secondary header actions (zoom, theme, etc.). */
export function HeaderMoreMenu({
  items,
  label,
}: {
  items: HeaderMoreItem[];
  label?: string;
}) {
  const { t } = useI18n();
  const resolved = label ?? t("nav.more");
  if (items.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={resolved} aria-label={resolved}>
          <IconMore />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={item.onClick}
            className={
              item.active
                ? "bg-[var(--accent-soft)] text-[var(--accent-foreground)]"
                : undefined
            }
          >
            {item.icon ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/[0.04] text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300">
                {item.icon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.shortcut ? (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
