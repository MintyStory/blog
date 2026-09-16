import { NextResponse } from "next/server";
import { requireAdmin, isAdminResult } from "@/lib/requireAdmin";
import { getCategoryMeta, updateCategory, deleteCategory, type CategoryInput } from "@/lib/categories";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const category = await getCategoryMeta(slug);
  if (!category) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const existing = await getCategoryMeta(slug);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = (await req.json()) as Partial<CategoryInput>;
  const input: CategoryInput = {
    label: body.label ?? existing.label,
    description: body.description ?? existing.description,
    coverImage: body.coverImage ?? existing.coverImage,
  };

  await updateCategory(slug, input);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  await deleteCategory(slug);
  return NextResponse.json({ ok: true });
}
