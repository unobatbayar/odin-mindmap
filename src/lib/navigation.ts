export interface NavItem {
  href: string;
  labelKey:
    | "nav.mindmap"
    | "nav.network"
    | "nav.dashboard"
    | "nav.performance"
    | "nav.timeline"
    | "nav.portfolio"
    | "nav.activity";
  match: (pathname: string) => boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  {
    href: "/mindmap",
    labelKey: "nav.mindmap",
    match: (pathname) => pathname === "/" || pathname.startsWith("/mindmap"),
  },
  {
    href: "/network",
    labelKey: "nav.network",
    match: (pathname) => pathname.startsWith("/network"),
  },
  {
    href: "/performance",
    labelKey: "nav.performance",
    match: (pathname) => pathname.startsWith("/performance"),
  },
];

export const SECONDARY_NAV: NavItem[] = [
  {
    href: "/dashboard",
    labelKey: "nav.dashboard",
    match: (pathname) => pathname.startsWith("/dashboard"),
  },
  {
    href: "/timeline",
    labelKey: "nav.timeline",
    match: (pathname) => pathname.startsWith("/timeline"),
  },
  {
    href: "/portfolio",
    labelKey: "nav.portfolio",
    match: (pathname) => pathname.startsWith("/portfolio"),
  },
  {
    href: "/activity",
    labelKey: "nav.activity",
    match: (pathname) => pathname.startsWith("/activity"),
  },
];

export const ALL_NAV: NavItem[] = [...PRIMARY_NAV, ...SECONDARY_NAV];

export function currentNavLabelKey(
  pathname: string,
): NavItem["labelKey"] | "nav.menu" {
  return ALL_NAV.find((item) => item.match(pathname))?.labelKey ?? "nav.menu";
}

export function isNavActive(pathname: string, item: NavItem): boolean {
  return item.match(pathname);
}
