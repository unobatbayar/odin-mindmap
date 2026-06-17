interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: number;
}

export function Avatar({ name, src, size = 24 }: AvatarProps) {
  const displayName = name?.trim() || "?";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const ringClass = "ring-2 ring-[var(--panel-solid)]";

  if (src) {
    return (
      <img
        src={src}
        alt={displayName}
        width={size}
        height={size}
        className={`rounded-full ${ringClass} object-cover`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold ${ringClass}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
