import { AccessLoginForm } from "@/components/auth/AccessLoginForm";
import { isAccessRequired } from "@/lib/access";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!isAccessRequired()) {
    redirect("/mindmap");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/mindmap";

  return (
    <div className="canvas-bg flex min-h-[100dvh] items-center justify-center px-4 py-10">
      <div className="glass-strong w-full max-w-md rounded-3xl border border-[var(--border)] p-8 shadow-surface-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden>
              <circle cx="16" cy="16" r="3" fill="white" />
              <circle cx="8" cy="10" r="2" fill="white" fillOpacity="0.85" />
              <circle cx="24" cy="10" r="2" fill="white" fillOpacity="0.85" />
              <circle cx="8" cy="22" r="2" fill="white" fillOpacity="0.85" />
              <circle cx="24" cy="22" r="2" fill="white" fillOpacity="0.85" />
              <path
                d="M13 14L9 11M19 14L23 11M13 18L9 21M19 18L23 21"
                stroke="white"
                strokeOpacity="0.8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gradient">Odin Mindmap</h1>
            <p className="text-sm text-[var(--muted)]">Company access required</p>
          </div>
        </div>

        <AccessLoginForm callbackUrl={callbackUrl} />

        <p className="mt-6 text-center text-xs leading-relaxed text-[var(--muted)]">
          Enter the shared access PIN to view the app. Admin PIN is still required separately to
          unlock editing.
        </p>
      </div>
    </div>
  );
}
