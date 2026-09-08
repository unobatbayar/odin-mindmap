"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { AdminUnlockResult } from "@/hooks/useAdminUnlocked";
import type { MessageKey } from "@/lib/i18n/messages";

interface PerformanceLockScreenProps {
  onUnlock: (pin: string) => Promise<AdminUnlockResult>;
}

export function PerformanceLockScreen({ onUnlock }: PerformanceLockScreenProps) {
  const { t } = useI18n();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  async function tryUnlock() {
    if (unlocking) return;
    setUnlocking(true);
    setError(null);
    try {
      const result = await onUnlock(pin);
      if (!result.ok) setError(t(`admin.${result.error}` as MessageKey));
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center p-6">
      <div className="glass-strong w-full max-w-md rounded-2xl border border-[var(--border)] p-6 text-center shadow-surface-lg">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t("admin.only")}
        </p>
        <h2 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {t("admin.unlockTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("admin.unlockBody")}
        </p>
        <div className="mt-4 space-y-2 text-left">
          <Input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t("common.pin")}
            type="password"
            aria-label={t("admin.pinLabel")}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || unlocking) return;
              void tryUnlock();
            }}
          />
          <Button
            variant="outline"
            className="w-full"
            disabled={unlocking}
            onClick={() => void tryUnlock()}
          >
            {unlocking ? t("common.unlocking") : t("common.unlock")}
          </Button>
          {error ? (
            <p className="text-center text-xs text-red-500">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
