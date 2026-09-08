"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { HeaderSelect } from "@/components/ui/Select";
import {
  AppHeader,
  HeaderContextGroup,
  HeaderControl,
} from "@/components/layout/AppHeader";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { usePersistedWorkspace } from "@/hooks/usePersistedWorkspace";
import { NetworkCanvas } from "@/components/network/NetworkCanvas";
import type { NetworkViewMode } from "@/types/network";

export default function NetworkPage() {
  const { t } = useI18n();
  const { workspaces, loading: wsLoading, activeTeamId, setTeamId } =
    usePersistedWorkspace();
  const [viewMode, setViewMode] = useState<NetworkViewMode>("people");
  const [collabOnly, setCollabOnly] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <AppHeader
        filters={
          <>
            <HeaderContextGroup>
              <HeaderControl label={t("common.workspace")} grouped>
                <HeaderSelect
                  value={activeTeamId ?? ""}
                  onValueChange={setTeamId}
                  disabled={wsLoading || workspaces.length === 0}
                  aria-label={t("common.workspace")}
                  options={workspaces.map((w) => ({
                    value: w.id,
                    label: w.label,
                  }))}
                />
              </HeaderControl>
            </HeaderContextGroup>

            <div className="flex min-w-0 items-center gap-1.5 xl:gap-2">
              <div className="glass-solid flex shrink-0 rounded-xl border border-[var(--border-strong)] p-0.5">
                {(["people", "projects"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors xl:px-3 ${
                      viewMode === mode
                        ? "bg-[var(--accent-soft)] text-[var(--accent-foreground)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {t(
                      mode === "people" ? "network.people" : "network.projects",
                    )}
                  </button>
                ))}
              </div>

              <label
                className="flex min-w-0 cursor-pointer items-center gap-1.5 text-xs font-medium text-[var(--foreground)]"
                title={t("network.collabOnly")}
              >
                <input
                  type="checkbox"
                  checked={collabOnly}
                  onChange={(e) => setCollabOnly(e.target.checked)}
                  className="rounded border-[var(--border-strong)] accent-[var(--accent)]"
                />
                <span className="hidden 2xl:inline">{t("network.collabOnly")}</span>
                <span className="truncate 2xl:hidden">{t("network.collabShort")}</span>
              </label>
            </div>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.search")}
              className="min-w-0 w-full py-2 text-xs sm:w-28 xl:w-36"
            />
          </>
        }
      />

      <div className="canvas-bg safe-bottom flex min-h-0 flex-1 flex-col">
        {activeTeamId ? (
          <NetworkCanvas
            teamId={activeTeamId}
            viewMode={viewMode}
            search={search}
            collabOnly={collabOnly}
          />
        ) : (
          <div className="canvas-bg flex h-full items-center justify-center">
            <p className="text-sm font-medium text-[var(--muted)]">
              {wsLoading
                ? t("common.loadingWorkspaces")
                : t("common.noWorkspace")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
