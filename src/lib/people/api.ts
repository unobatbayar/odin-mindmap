import type { MemberPerformance, PeopleRoster } from "@/types/people";

function buildQuery(
  listId?: string | null,
  from?: string | null,
  to?: string | null,
): string {
  const params = new URLSearchParams();
  if (listId) params.set("listId", listId);
  if (from && to) {
    params.set("from", from);
    params.set("to", to);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function performanceQuery(opts: {
  listId: string | null;
  from: string;
  to: string;
  range?: string | null;
}): URLSearchParams {
  const params = new URLSearchParams();
  if (opts.listId) params.set("listId", opts.listId);
  if (opts.from && opts.to) {
    params.set("from", opts.from);
    params.set("to", opts.to);
  }
  if (opts.range && opts.range !== "custom") {
    params.set("range", opts.range);
  }
  return params;
}

export function rosterHref(query: URLSearchParams): string {
  const s = query.toString();
  return s ? `/performance?${s}` : "/performance";
}

export function personHref(
  userId: number | string,
  query: URLSearchParams,
): string {
  const s = query.toString();
  return s ? `/performance/${userId}?${s}` : `/performance/${userId}`;
}

export async function fetchPeopleRoster(
  teamId: string,
  listId?: string | null,
  from?: string | null,
  to?: string | null,
): Promise<PeopleRoster> {
  const res = await fetch(
    `/api/people/${teamId}${buildQuery(listId, from, to)}`,
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to load people");
  }
  return res.json();
}

export async function fetchMemberPerformance(
  teamId: string,
  userId: string,
  listId?: string | null,
  from?: string | null,
  to?: string | null,
): Promise<MemberPerformance> {
  const res = await fetch(
    `/api/people/${teamId}/${userId}${buildQuery(listId, from, to)}`,
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to load performance");
  }
  return res.json();
}
