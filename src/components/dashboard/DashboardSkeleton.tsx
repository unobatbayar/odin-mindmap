export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-strong h-24 rounded-2xl border border-[var(--border)] p-4 shadow-surface"
          >
            <div className="loading-shimmer h-3 w-16 rounded" />
            <div className="loading-shimmer mt-3 h-8 w-12 rounded" />
            <div className="loading-shimmer mt-2 h-3 w-24 rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-strong h-64 rounded-2xl border border-[var(--border)] p-5 shadow-surface">
          <div className="loading-shimmer h-4 w-24 rounded" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="loading-shimmer h-10 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="glass-strong h-64 rounded-2xl border border-[var(--border)] p-5 shadow-surface">
          <div className="loading-shimmer h-4 w-24 rounded" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="loading-shimmer h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <div className="glass-strong h-72 rounded-2xl border border-[var(--border)] p-5 shadow-surface">
        <div className="loading-shimmer h-4 w-32 rounded" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="loading-shimmer h-40 rounded-xl" />
          <div className="loading-shimmer h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
