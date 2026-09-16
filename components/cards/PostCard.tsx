import type { Post } from "@/types/post";
import ImageOverlayCard from "./ImageOverlayCard";

export default function PostCard({ post, viewCount }: { post: Post; viewCount?: number }) {
  return (
    <ImageOverlayCard href={`/posts/${post.slug}`} image={post.coverImage} alt={post.title}>
      <span className="text-[10px] font-semibold tracking-[0.07em] uppercase text-white/60 mb-1.5">
        {post.categoryLabel}
      </span>
      <h3 className="text-[15px] font-bold text-white leading-[1.4] mb-1.5">{post.title}</h3>
      <div className="flex items-center gap-2 text-xs text-white/45">
        <span>{post.date.replaceAll("-", ". ")}</span>
        {typeof viewCount === "number" && (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>조회 {viewCount.toLocaleString()}</span>
          </>
        )}
      </div>
    </ImageOverlayCard>
  );
}
