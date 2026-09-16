import { NextResponse } from "next/server";
import { requireAdmin, isAdminResult } from "@/lib/requireAdmin";
import { getAllPosts } from "@/lib/posts";
import { getAllViewCounts } from "@/lib/viewCounts";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const [viewCounts, posts] = await Promise.all([getAllViewCounts(), getAllPosts({ includeDrafts: true })]);
  const rows = posts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      categoryLabel: post.categoryLabel,
      date: post.date,
      viewCount: viewCounts[post.slug] ?? 0,
    }))
    .sort((a, b) => b.viewCount - a.viewCount);

  return NextResponse.json({ rows });
}
