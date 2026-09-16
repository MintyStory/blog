import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { getViewCount, getViewCounts } from "@/lib/viewCounts";
import { extractToc } from "@/lib/markdown";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { CategoryPill } from "@/components/ui/TagPill";
import TableOfContents from "@/components/post/TableOfContents";
import PostBody from "@/components/post/PostBody";
import PrevNextNav from "@/components/post/PrevNextNav";
import RelatedPosts from "@/components/post/RelatedPosts";
import LikeShareButtons from "@/components/post/LikeShareButtons";
import CommentsSection from "@/components/post/CommentsSection";
import ViewCounter from "@/components/post/ViewCounter";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const post = await getPostBySlug(decodeURIComponent(rawSlug));
  if (!post) return {};
  return { title: `${post.title} — DEV LOG`, description: post.excerpt };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [viewCount, related, adjacent] = await Promise.all([
    getViewCount(post.slug),
    getRelatedPosts(post),
    getAdjacentPosts(post),
  ]);
  const relatedViewCounts = await getViewCounts(related.map((p) => p.slug));
  const toc = extractToc(post.content);

  return (
    <article className="pt-32 pb-24 md:pt-40 md:pb-32">
      <ViewCounter slug={post.slug} />
      <div className="container-blog">
        <Breadcrumb
          items={[
            { label: "전체 글", href: "/posts" },
            { label: post.categoryLabel, href: `/categories/${post.category}` },
            { label: post.title },
          ]}
        />

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-md overflow-hidden mb-10">
          <Image src={post.coverImage} alt={post.title} fill sizes="100vw" className="object-cover" priority />
        </div>

        <CategoryPill label={post.categoryLabel} />
        <h1 className="text-[28px] md:text-[40px] font-extrabold leading-[1.25] tracking-[-0.02em] mt-4 mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-sub mb-10">
          <span>{post.date.replaceAll("-", ". ")}</span>
          <span aria-hidden="true">&middot;</span>
          <span>조회 {viewCount.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
          <TableOfContents items={toc} />
          <div>
            <PostBody content={post.content} />

            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-text-sub border border-black/15 rounded-full px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>

            <LikeShareButtons />
            <PrevNextNav prev={adjacent.prev} next={adjacent.next} />
            <RelatedPosts posts={related} viewCounts={relatedViewCounts} />
            <CommentsSection />
          </div>
        </div>
      </div>
    </article>
  );
}
