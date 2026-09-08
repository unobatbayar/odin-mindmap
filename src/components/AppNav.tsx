"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeaderSelect } from "@/components/ui/Select";
import {
  ALL_NAV,
  PRIMARY_NAV,
  SECONDARY_NAV,
  isNavActive,
  type NavItem,
} from "@/lib/navigation";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const ICON_SIZE = 18;

function IconMindmap() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="3" cy="4" r="1.5" fill="currentColor" fillOpacity="0.85" />
      <circle cx="13" cy="4" r="1.5" fill="currentColor" fillOpacity="0.85" />
      <circle cx="3" cy="12" r="1.5" fill="currentColor" fillOpacity="0.85" />
      <circle cx="13" cy="12" r="1.5" fill="currentColor" fillOpacity="0.85" />
      <path
        d="M6.2 6.8L4.2 5M9.8 6.8L11.8 5M6.2 9.2L4.2 11M9.8 9.2L11.8 11"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
    </svg>
  );
}

function IconNetwork() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="8" cy="3.5" r="1.75" />
      <circle cx="3.5" cy="12" r="1.75" />
      <circle cx="12.5" cy="12" r="1.75" />
      <path d="M8 5.3v2.2M8 7.5L4.8 10.4M8 7.5l3.2 2.9" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="5.5" height="5.5" rx="1.2" />
      <rect x="8.5" y="2" width="5.5" height="3.5" rx="1.2" />
      <rect x="8.5" y="7" width="5.5" height="7" rx="1.2" />
      <rect x="2" y="9" width="5.5" height="5" rx="1.2" />
    </svg>
  );
}

function IconTimeline() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 2.5v11" />
      <path d="M5.5 4.5h7" />
      <path d="M5.5 8h4.5" />
      <path d="M5.5 11.5h6" />
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 5.5h11v7a1.5 1.5 0 01-1.5 1.5h-8a1.5 1.5 0 01-1.5-1.5v-7z" />
      <path d="M5.5 5.5V4a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0110.5 4v1.5" />
      <path d="M2.5 8.5h11" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 8h2.5l1.5-4 2.5 8 1.5-4H14" />
    </svg>
  );
}

function IconPerformance() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="5.5" cy="5" r="2" />
      <path d="M2.5 13c.35-1.9 1.6-3 3-3s2.65 1.1 3 3" />
      <path d="M10 6.5h4M10 9.5h2.5M10 12.5h3.5" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" />
    </svg>
  );
}

const NAV_ICONS: Record<string, ReactNode> = {
  "/mindmap": <IconMindmap />,
  "/network": <IconNetwork />,
  "/dashboard": <IconDashboard />,
  "/performance": <IconPerformance />,
  "/timeline": <IconTimeline />,
  "/portfolio": <IconPortfolio />,
  "/activity": <IconActivity />,
};

function navPillClass(active: boolean) {
  return cn(
    "inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-2 text-[13px] font-semibold leading-none",
    "transition-[background-color,color,transform] duration-200 ease-out",
    "active:scale-[0.97]",
    active
      ? "bg-[var(--accent-soft)] text-[var(--accent-foreground)]"
      : "text-[var(--muted)] hover:bg-black/[0.04] hover:text-zinc-700 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200",
  );
}

function PrimaryNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const { t } = useI18n();
  const active = isNavActive(pathname, item);
  const label = t(item.labelKey);

  return (
    <Link
      href={item.href}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={navPillClass(active)}
    >
      <span
        className={cn(
          "flex items-center justify-center transition-transform duration-200 ease-out",
          active ? "scale-105" : "opacity-90",
        )}
      >
        {NAV_ICONS[item.href]}
      </span>
      <span>{label}</span>
    </Link>
  );
}

function SecondaryNavMenu({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const secondaryActive = SECONDARY_NAV.some((item) => isNavActive(pathname, item));
  const activeSecondary = SECONDARY_NAV.find((item) => isNavActive(pathname, item));
  const triggerLabel = activeSecondary
    ? t(activeSecondary.labelKey)
    : t("nav.more");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={navPillClass(secondaryActive || open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("nav.more")}
      >
        <span className={cn("flex items-center justify-center", secondaryActive ? "scale-105" : "opacity-90")}>
          {activeSecondary ? NAV_ICONS[activeSecondary.href] : <IconMore />}
        </span>
        <span>{triggerLabel}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={cn(
            "opacity-70 transition-transform duration-150",
            open ? "rotate-180" : "",
          )}
          aria-hidden
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1.5 w-[220px] overflow-hidden rounded-xl border border-[var(--border-strong)] glass-solid p-1 shadow-surface-lg"
        >
          {SECONDARY_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent-foreground)]"
                    : "text-zinc-700 hover:bg-black/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.06]",
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/[0.04] text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300">
                  {NAV_ICONS[item.href]}
                </span>
                <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
                {active ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="shrink-0 text-[var(--accent)]"
                    aria-hidden
                  >
                    <path d="M3 7l3 3 5-5.5" />
                  </svg>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav
      aria-label={t("nav.main")}
      className="hidden min-w-0 items-center gap-1 whitespace-nowrap lg:flex"
    >
      {PRIMARY_NAV.map((item) => (
        <PrimaryNavLink key={item.href} item={item} pathname={pathname} />
      ))}
      <div
        className="mx-0.5 h-4 w-px shrink-0 bg-[var(--border-strong)]"
        aria-hidden
      />
      <SecondaryNavMenu pathname={pathname} />
    </nav>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const activeHref = useMemo(
    () => ALL_NAV.find((item) => isNavActive(pathname, item))?.href ?? "/mindmap",
    [pathname],
  );

  return (
    <>
      <div className="lg:hidden">
        <HeaderSelect
          value={activeHref}
          onValueChange={(href) => router.push(href)}
          options={ALL_NAV.map((item) => ({
            value: item.href,
            label: t(item.labelKey),
          }))}
          aria-label={t("nav.navigate")}
          className="w-full max-w-none lg:max-w-none"
        />
      </div>

      <DesktopNav />
    </>
  );
}
