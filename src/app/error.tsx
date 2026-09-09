"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Something went wrong.
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Алдаа гарлаа.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Try again / Дахин оролдох
        </button>
      </div>
    </div>
  );
}
