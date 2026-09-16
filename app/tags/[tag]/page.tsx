import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByTag } from "@/lib/posts";
import { getViewCounts } from "@/lib/viewCounts";
import Eyebrow from "@/components/ui/Eyebrow";
import PostListView from "@/components/post/PostListView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)} — DEV LOG` };
}

export default async function TagDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const tagPosts = await getPostsByTag(tag);
  if (tagPosts.length === 0) notFound();

  const viewCounts = await getViewCounts(tagPosts.map((p) => p.slug));

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-blog">
        <div className="mb-11">
          <Eyebrow>Tag</Eyebrow>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">#{tag}</h1>
        </div>
        <PostListView posts={tagPosts} viewCounts={viewCounts} showSort={false} />
      </div>
    </div>
  );
}
