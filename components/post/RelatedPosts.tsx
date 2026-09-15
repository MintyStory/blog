import type { Post } from "@/data/posts";
import PostCard from "@/components/cards/PostCard";
import Eyebrow from "@/components/ui/Eyebrow";

export default function RelatedPosts({ posts, viewCounts }: { posts: Post[]; viewCounts: Record<string, number> }) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-20">
      <Eyebrow>Related Posts</Eyebrow>
      <h3 className="text-2xl font-extrabold mb-8">관련 글</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} viewCount={viewCounts[post.slug]} />
        ))}
      </div>
    </div>
  );
}
