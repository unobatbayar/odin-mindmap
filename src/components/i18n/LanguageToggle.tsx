"use client";

import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const next = locale === "mn" ? "en" : "mn";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocale(next)}
          aria-label={t("language.toggle")}
          className="text-[11px] font-bold tracking-wide"
        >
          {next === "en" ? "EN" : "MN"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {next === "en"
          ? t("language.switchToEnglish")
          : t("language.switchToMongolian")}
      </TooltipContent>
    </Tooltip>
  );
}
