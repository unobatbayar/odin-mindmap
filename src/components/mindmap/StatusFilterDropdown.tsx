"use client";

import { headerDropdownTriggerClass } from "@/components/layout/AppHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statusFilterMessageKey, useI18n } from "@/components/i18n/LocaleProvider";
import { STATUS_FILTER_OPTIONS, type TaskStatusFilter } from "@/lib/mindmap/constants";
import { ChevronDown } from "lucide-react";

function StatusIcon({ filter, color }: { filter: TaskStatusFilter; color: string }) {
  switch (filter) {
    case "all":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="3.5" cy="3.5" r="1.5" fill={color} />
          <circle cx="10.5" cy="3.5" r="1.5" fill={color} />
          <circle cx="3.5" cy="10.5" r="1.5" fill={color} />
          <circle cx="10.5" cy="10.5" r="1.5" fill={color} />
        </svg>
      );
    case "open":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "custom":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="2" />
          <path d="M7 7V2" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="7" cy="7" r="1.5" fill={color} />
        </svg>
      );
    case "closed":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" fill={color} />
          <path d="M4.5 7l2 2 3-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: TaskStatusFilter;
  onChange: (value: TaskStatusFilter) => void;
}) {
  const { t } = useI18n();
  const current = STATUS_FILTER_OPTIONS.find((o) => o.value === value)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={headerDropdownTriggerClass}>
        <StatusIcon filter={value} color={current.color} />
        <span>{t(statusFilterMessageKey(current.value))}</span>
        <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[168px]">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as TaskStatusFilter)}
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              <span
                className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${opt.color}18` }}
              >
                <StatusIcon filter={opt.value} color={opt.color} />
              </span>
              {t(statusFilterMessageKey(opt.value))}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
