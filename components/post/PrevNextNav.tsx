import Link from "next/link";
import type { Post } from "@/types/post";

export default function PrevNextNav({ prev, next }: { prev: Post | null; next: Post | null }) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="border border-black/10 rounded-md p-5 hover:border-black/30 transition-colors">
          <span className="text-xs text-text-sub block mb-2">&larr; 이전 글</span>
          <span className="font-bold leading-snug line-clamp-2">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="border border-black/10 rounded-md p-5 text-right hover:border-black/30 transition-colors">
          <span className="text-xs text-text-sub block mb-2">다음 글 &rarr;</span>
          <span className="font-bold leading-snug line-clamp-2">{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
