import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryMeta } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { getViewCounts } from "@/lib/viewCounts";
import PostListView from "@/components/post/PostListView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const meta = await getCategoryMeta(decodeURIComponent(rawCategory));
  return meta ? { title: `${meta.label} — DEV LOG` } : {};
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const meta = await getCategoryMeta(category);
  if (!meta) notFound();

  const categoryPosts = await getPostsByCategory(meta.slug);
  const viewCounts = await getViewCounts(categoryPosts.map((p) => p.slug));

  return (
    <div className="pb-24 md:pb-32">
      <div className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0">
          <Image src={meta.coverImage} alt="" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-surface-dark/55" />
        <div className="container-blog relative z-10 pb-12">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase text-white/70 mb-3 block">Category</span>
          <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-[1.15] tracking-[-0.025em] mb-2">{meta.label}</h1>
          <p className="text-white/70">{meta.description}</p>
        </div>
      </div>
      <div className="container-blog pt-16">
        <PostListView posts={categoryPosts} viewCounts={viewCounts} />
      </div>
    </div>
  );
}
