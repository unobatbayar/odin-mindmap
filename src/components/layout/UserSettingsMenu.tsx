"use client";

import { useState } from "react";
import { LogIn, LogOut, Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { useTheme } from "@/components/ui/ThemeProvider";
import {
  useAdminUnlocked,
  type AdminUnlockError,
} from "@/hooks/useAdminUnlocked";
import type { MessageKey } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

/** Header settings menu: theme, language, admin login/logout. */
export function UserSettingsMenu() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { adminUnlocked, unlockAdmin, lockAdmin, loading } = useAdminUnlocked();
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const tryUnlock = async () => {
    setPinError(null);
    setUnlocking(true);
    try {
      const result = await unlockAdmin(pin);
      if (result.ok) {
        setPinOpen(false);
        setPin("");
      } else {
        const err = result.error as AdminUnlockError;
        setPinError(t(`admin.${err}` as MessageKey));
      }
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("settings.menu")}
            title={t("settings.menu")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("settings.title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>{t("settings.appearance")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
            <span className="flex-1">
              {theme === "dark" ? t("theme.light") : t("theme.dark")}
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t("settings.language")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(value) => setLocale(value as Locale)}
          >
            <DropdownMenuRadioItem value="mn" className="gap-2">
              <span aria-hidden className="text-[13px] leading-none">
                🇲🇳
              </span>
              {t("language.switchToMongolian")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en" className="gap-2">
              <span aria-hidden className="text-[13px] leading-none">
                🇺🇸
              </span>
              {t("language.switchToEnglish")}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t("settings.admin")}</DropdownMenuLabel>
          {loading ? (
            <DropdownMenuItem disabled>{t("common.loading")}</DropdownMenuItem>
          ) : adminUnlocked ? (
            <DropdownMenuItem onClick={() => void lockAdmin()}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="flex-1">{t("admin.logout")}</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setPinOpen(true);
              }}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="flex-1">{t("admin.login")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={pinOpen}
        onOpenChange={(open) => {
          setPinOpen(open);
          if (!open) {
            setPin("");
            setPinError(null);
          }
        }}
      >
        <DialogContent className="max-w-[280px]">
          <DialogHeader>
            <DialogTitle>{t("admin.enterPin")}</DialogTitle>
            <DialogDescription>{t("admin.unlockHint")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t("common.pin")}
              type="password"
              autoFocus
              onKeyDown={(e) => {
                if (e.key !== "Enter" || unlocking) return;
                void tryUnlock();
              }}
            />
            <Button
              className="w-full"
              size="sm"
              disabled={unlocking || !pin.trim()}
              onClick={() => void tryUnlock()}
            >
              {unlocking ? t("common.unlocking") : t("admin.login")}
            </Button>
            {pinError ? (
              <p className="text-[11px] text-red-500">{pinError}</p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
