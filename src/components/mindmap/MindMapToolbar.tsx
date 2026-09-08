"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { HeaderSelect } from "@/components/ui/Select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AppHeader,
  HeaderContextGroup,
  HeaderControl,
  headerDropdownTriggerClass,
} from "@/components/layout/AppHeader";
import { HeaderMoreMenu, type HeaderMoreItem } from "@/components/layout/HeaderMoreMenu";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { AdminUnlockError } from "@/hooks/useAdminUnlocked";
import { StatusFilterDropdown } from "./StatusFilterDropdown";
import { Check, ChevronDown } from "lucide-react";
import type { TaskStatusFilter } from "@/lib/mindmap/constants";

export type MindMapScope =
  | { mode: "all" }
  | { mode: "member"; teamId: string; userId: string; label: string; profilePicture?: string | null };

export interface MemberOption {
  teamId: string;
  userId: string;
  label: string;
  profilePicture?: string | null;
}

interface WorkspaceOption {
  id: string;
  label: string;
}

interface MindMapToolbarProps {
  statusFilter: TaskStatusFilter;
  onStatusFilterChange: (filter: TaskStatusFilter) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  workspaces: WorkspaceOption[];
  activeTeamId: string | null;
  wsLoading: boolean;
  onTeamChange: (teamId: string) => void;
  scope: MindMapScope;
  onScopeChange: (scope: MindMapScope) => void;
  adminUnlocked: boolean;
  onAdminUnlock: (pin: string) => Promise<{ ok: true } | { ok: false; error: AdminUnlockError }>;
  onAdminLock: () => void;
  members: MemberOption[];
}

function IconZoomOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
      <path d="M5 7h4" />
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
      <path d="M5 7h4M7 5v4" />
    </svg>
  );
}

function IconFit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3" />
    </svg>
  );
}

function ScopeDropdown({
  scope,
  onChange,
  members,
}: {
  scope: MindMapScope;
  onChange: (s: MindMapScope) => void;
  members: MemberOption[];
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const label = scope.mode === "all" ? t("common.all") : scope.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={headerDropdownTriggerClass} title={t("common.scope")}>
          {scope.mode === "member" ? (
            <Avatar name={scope.label} src={scope.profilePicture} size={18} />
          ) : (
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-300">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2.5 3.5h9M2.5 7h9M2.5 10.5h9" />
              </svg>
            </span>
          )}
          <span className="max-w-[120px] truncate sm:max-w-[140px]">{label}</span>
          <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(280px,calc(100vw-2rem))] p-0"
        align="end"
      >
        <Command>
          <CommandInput placeholder={t("common.searchPeople")} />
          <CommandList>
            <CommandEmpty>{t("common.noMatches")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange({ mode: "all" });
                  setOpen(false);
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-300">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2.5 3.5h9M2.5 7h9M2.5 10.5h9" />
                  </svg>
                </span>
                <span className="flex-1">{t("common.all")}</span>
                {scope.mode === "all" ? (
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                ) : null}
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading={t("common.people")}>
              {members.map((m) => {
                const selected =
                  scope.mode === "member" &&
                  scope.teamId === m.teamId &&
                  scope.userId === m.userId;
                return (
                  <CommandItem
                    key={`${m.teamId}:${m.userId}`}
                    value={`${m.label} ${m.userId}`}
                    onSelect={() => {
                      onChange({
                        mode: "member",
                        teamId: m.teamId,
                        userId: m.userId,
                        label: m.label,
                        profilePicture: m.profilePicture,
                      });
                      setOpen(false);
                    }}
                  >
                    <Avatar name={m.label} src={m.profilePicture} size={22} />
                    <span className="flex-1 truncate">{m.label}</span>
                    {selected ? (
                      <Check className="h-3.5 w-3.5 text-blue-500" />
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function MindMapToolbar({
  statusFilter,
  onStatusFilterChange,
  onZoomIn,
  onZoomOut,
  onFitView,
  workspaces,
  activeTeamId,
  wsLoading,
  onTeamChange,
  scope,
  onScopeChange,
  members,
}: MindMapToolbarProps) {
  const { t } = useI18n();

  const moreItems: HeaderMoreItem[] = useMemo(
    () => [
      {
        id: "zoom-out",
        label: t("mindmap.zoomOut"),
        icon: <IconZoomOut />,
        shortcut: "−",
        onClick: onZoomOut,
      },
      {
        id: "zoom-in",
        label: t("mindmap.zoomIn"),
        icon: <IconZoomIn />,
        shortcut: "+",
        onClick: onZoomIn,
      },
      {
        id: "fit",
        label: t("mindmap.fitView"),
        icon: <IconFit />,
        shortcut: "0",
        onClick: onFitView,
      },
    ],
    [onFitView, onZoomIn, onZoomOut, t],
  );

  return (
    <AppHeader
      filters={
        <HeaderContextGroup>
          <HeaderControl label={t("common.workspace")} grouped>
            <HeaderSelect
              value={activeTeamId ?? ""}
              onValueChange={onTeamChange}
              disabled={wsLoading || workspaces.length === 0}
              aria-label={t("common.workspace")}
              options={workspaces.map((w) => ({ value: w.id, label: w.label }))}
            />
          </HeaderControl>
          <HeaderControl label={t("common.scope")} grouped>
            <ScopeDropdown scope={scope} onChange={onScopeChange} members={members} />
          </HeaderControl>
          <HeaderControl label={t("common.status")} grouped>
            <StatusFilterDropdown value={statusFilter} onChange={onStatusFilterChange} />
          </HeaderControl>
        </HeaderContextGroup>
      }
      actions={
        <HeaderMoreMenu items={moreItems} label={t("common.viewOptions")} />
      }
    />
  );
}
