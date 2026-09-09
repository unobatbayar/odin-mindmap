import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Page not found.
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Хуудас олдсонгүй.
        </p>
        <Link
          href="/mindmap"
          className="mt-4 inline-block rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Go to mindmap / Оюуны зураг руу
        </Link>
      </div>
    </div>
  );
}
