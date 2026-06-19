"use client";

import { useEffect, useState } from "react";
import { fetchWorkspaces } from "@/lib/mindmap/api";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<{ id: string; label: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaces()
      .then((nodes) => {
        setWorkspaces(
          nodes.map((n) => ({ id: n.data.clickupId, label: n.data.label })),
        );
      })
      .catch(() => setWorkspaces([]))
      .finally(() => setLoading(false));
  }, []);

  return { workspaces, loading };
}
