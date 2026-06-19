export interface NavItem {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  {
    href: "/mindmap",
    label: "Mindmap",
    match: (pathname) => pathname === "/" || pathname.startsWith("/mindmap"),
  },
  {
    href: "/network",
    label: "Network",
    match: (pathname) => pathname.startsWith("/network"),
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    match: (pathname) => pathname.startsWith("/dashboard"),
  },
];

export const SECONDARY_NAV: NavItem[] = [
  {
    href: "/timeline",
    label: "Timeline",
    match: (pathname) => pathname.startsWith("/timeline"),
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    match: (pathname) => pathname.startsWith("/portfolio"),
  },
  {
    href: "/activity",
    label: "Activity",
    match: (pathname) => pathname.startsWith("/activity"),
  },
];

export const ALL_NAV: NavItem[] = [...PRIMARY_NAV, ...SECONDARY_NAV];

export function currentNavLabel(pathname: string): string {
  return ALL_NAV.find((item) => item.match(pathname))?.label ?? "Menu";
}

export function isNavActive(pathname: string, item: NavItem): boolean {
  return item.match(pathname);
}
