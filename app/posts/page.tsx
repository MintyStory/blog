import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { getViewCounts } from "@/lib/viewCounts";
import Eyebrow from "@/components/ui/Eyebrow";
import PostListView from "@/components/post/PostListView";

export const metadata: Metadata = { title: "전체 글 — DEV LOG" };
export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await getAllPosts();
  const viewCounts = await getViewCounts(posts.map((p) => p.slug));

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-blog">
        <div className="mb-11">
          <Eyebrow>All Posts</Eyebrow>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">전체 글</h1>
        </div>
        <PostListView posts={posts} viewCounts={viewCounts} />
      </div>
    </div>
  );
}
