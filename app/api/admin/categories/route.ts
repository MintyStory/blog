import { NextResponse } from "next/server";
import { requireAdmin, isAdminResult } from "@/lib/requireAdmin";
import { getAllCategories, createCategory, type CategoryInput } from "@/lib/categories";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isAdminResult(admin)) return admin;

  const body = (await req.json()) as Partial<CategoryInput> & { slug?: string };
  if (!body.label || !body.slug) {
    return NextResponse.json({ error: "label과 slug는 필수입니다." }, { status: 400 });
  }

  const slug = slugify(body.slug);
  if (!slug) {
    return NextResponse.json({ error: "유효하지 않은 slug입니다." }, { status: 400 });
  }

  const input: CategoryInput = {
    label: body.label,
    description: body.description ?? "",
    coverImage: body.coverImage || "/images/category-frontend.webp",
  };

  try {
    await createCategory(slug, input);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "저장 실패" }, { status: 409 });
  }

  return NextResponse.json({ slug }, { status: 201 });
}
