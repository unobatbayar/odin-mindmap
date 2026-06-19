"use client";

import { useCallback, useEffect, useState } from "react";

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

  const unlockAdmin = useCallback(async (pin: string) => {
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (!res.ok) return false;

    setAdminUnlocked(true);
    return true;
  }, []);

  const lockAdmin = useCallback(async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAdminUnlocked(false);
  }, []);

  return { adminUnlocked, loading, unlockAdmin, lockAdmin };
}
