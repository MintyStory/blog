import { NextResponse } from "next/server";
import { requireAdmin, isAdminResult } from "@/lib/requireAdmin";
import { getPostBySlug, updatePost, deletePost, type PostInput } from "@/lib/posts";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getPostBySlug(slug, { includeDrafts: true });
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const existing = await getPostBySlug(slug, { includeDrafts: true });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = (await req.json()) as Partial<PostInput>;
  const input: PostInput = {
    title: body.title ?? existing.title,
    excerpt: body.excerpt ?? existing.excerpt,
    category: body.category ?? existing.category,
    categoryLabel: body.categoryLabel ?? existing.categoryLabel,
    tags: body.tags ?? existing.tags,
    coverImage: body.coverImage ?? existing.coverImage,
    date: body.date ?? existing.date,
    content: body.content ?? existing.content,
    popular: body.popular ?? existing.popular,
    status: body.status ?? existing.status,
  };

  await updatePost(slug, input);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  await deletePost(slug);
  return NextResponse.json({ ok: true });
}
