"use client";

import { useCallback, useMemo, useState } from "react";
import { useWorkspaces } from "./useWorkspaces";

export const WORKSPACE_STORAGE_KEY = "odin_workspace_id";

function readStoredTeamId(): string | null {
  try {
    return window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function usePersistedWorkspace() {
  const { workspaces, loading } = useWorkspaces();
  const [teamId, setTeamIdState] = useState<string | null>(readStoredTeamId);

  const activeTeamId = useMemo(() => {
    if (teamId && workspaces.some((w) => w.id === teamId)) return teamId;
    return workspaces[0]?.id ?? null;
  }, [teamId, workspaces]);

  const setTeamId = useCallback((id: string) => {
    setTeamIdState(id);
    try {
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  return { workspaces, loading, activeTeamId, setTeamId };
}
