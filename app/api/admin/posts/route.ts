import { NextResponse } from "next/server";
import { requireAdmin, isAdminResult } from "@/lib/requireAdmin";
import { getAllPosts, createPost, type PostInput } from "@/lib/posts";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const posts = await getAllPosts({ includeDrafts: true });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const body = (await req.json()) as Partial<PostInput> & { slug?: string };
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: "title과 slug는 필수입니다." }, { status: 400 });
  }

  const slug = slugify(body.slug);
  if (!slug) {
    return NextResponse.json({ error: "유효하지 않은 slug입니다." }, { status: 400 });
  }

  const input: PostInput = {
    title: body.title,
    excerpt: body.excerpt ?? "",
    category: body.category ?? "frontend",
    categoryLabel: body.categoryLabel ?? "Frontend",
    tags: body.tags ?? [],
    coverImage: body.coverImage || "/images/category-frontend.webp",
    date: body.date || new Date().toISOString().slice(0, 10),
    content: body.content ?? "",
    popular: Boolean(body.popular),
    status: body.status === "draft" ? "draft" : "published",
  };

  try {
    await createPost(slug, input);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "저장 실패" }, { status: 409 });
  }

  return NextResponse.json({ slug }, { status: 201 });
}
