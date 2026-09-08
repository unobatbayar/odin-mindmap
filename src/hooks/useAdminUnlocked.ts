"use client";

import { useCallback, useEffect, useState } from "react";

export type AdminUnlockError = "tooMany" | "unconfigured" | "wrongPin" | "unable";

export type AdminUnlockResult = { ok: true } | { ok: false; error: AdminUnlockError };

export function useAdminUnlocked() {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAdminUnlocked(data.unlocked === true);
      })
      .catch(() => {
        if (!cancelled) setAdminUnlocked(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const unlockAdmin = useCallback(async (pin: string): Promise<AdminUnlockResult> => {
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        setAdminUnlocked(true);
        window.location.reload();
        return { ok: true };
      }

      if (res.status === 429) {
        return { ok: false, error: "tooMany" };
      }
      if (res.status === 503) {
        return { ok: false, error: "unconfigured" };
      }

      return { ok: false, error: "wrongPin" };
    } catch {
      return { ok: false, error: "unable" };
    }
  }, []);

  const lockAdmin = useCallback(async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAdminUnlocked(false);
    window.location.reload();
  }, []);

  return { adminUnlocked, loading, unlockAdmin, lockAdmin };
}
