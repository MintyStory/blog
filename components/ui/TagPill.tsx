import Link from "next/link";

export function TagPill({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="inline-flex items-center gap-1.5 border border-black rounded-full px-4 py-2 text-[1em] hover:bg-black hover:text-white transition-colors"
    >
      #{tag}
      {typeof count === "number" && <span className="text-text-sub">({count})</span>}
    </Link>
  );
}

export function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-black/20 rounded-full px-3 py-1 text-xs text-text-sub">
      {label}
    </span>
  );
}
