"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Post, PostStatus, CategorySlug } from "@/types/post";
import type { Category } from "@/types/category";
import { availableImages } from "@/data/availableImages";
import { slugify } from "@/lib/slugify";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import PostBody from "@/components/post/PostBody";

const inputClass =
  "w-full border border-black/15 rounded-md px-4 py-2.5 text-[15px] outline-none focus:border-primary transition-colors";
const labelClass = "block text-sm font-bold mb-2";

export interface PostFormValues {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  tags: string; // comma-separated in the form
  coverImage: string;
  date: string;
  content: string;
  popular: boolean;
  status: PostStatus;
}

function toFormValues(post?: Post): PostFormValues {
  return {
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    category: post?.category ?? "frontend",
    tags: post?.tags.join(", ") ?? "",
    coverImage: post?.coverImage ?? availableImages[0],
    date: post?.date ?? new Date().toISOString().slice(0, 10),
    content: post?.content ?? "",
    popular: post?.popular ?? false,
    status: post?.status ?? "draft",
  };
}

export default function PostForm({ mode, post }: { mode: "create" | "edit"; post?: Post }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [values, setValues] = useState<PostFormValues>(toFormValues(post));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (!cancelled) setCategories(data.categories ?? []);
      } catch {
        // 카테고리 목록을 못 불러와도 폼 자체는 계속 쓸 수 있어야 한다.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryMeta = categories.find((c) => c.slug === values.category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: values.title,
      excerpt: values.excerpt,
      category: values.category,
      categoryLabel: categoryMeta?.label ?? values.category,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage: values.coverImage,
      date: values.date,
      content: values.content,
      popular: values.popular,
      status: values.status,
    };

    try {
      if (mode === "create") {
        const res = await adminFetch("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify({ ...payload, slug: values.slug }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "저장 실패");
        router.push(`/admin/posts/${data.slug}/edit`);
        router.refresh();
      } else {
        const res = await adminFetch(`/api/admin/posts/${post!.slug}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "저장 실패");
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm(`"${post.title}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/posts/${post.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      router.push("/admin/posts");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>}

      <div>
        <label className={labelClass} htmlFor="title">
          제목
        </label>
        <input
          id="title"
          required
          className={inputClass}
          value={values.title}
          onChange={(e) => {
            const title = e.target.value;
            setValues((v) => ({
              ...v,
              title,
              slug: mode === "create" && !slugTouched ? slugify(title) : v.slug,
            }));
          }}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">
          Slug (URL) {mode === "edit" && <span className="font-normal text-text-sub">— 생성 후에는 변경할 수 없습니다</span>}
        </label>
        <input
          id="slug"
          required
          disabled={mode === "edit"}
          className={`${inputClass} disabled:bg-surface-muted disabled:text-text-sub`}
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setValues((v) => ({ ...v, slug: slugify(e.target.value) }));
          }}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">
          요약 (목록/카드에 노출)
        </label>
        <textarea
          id="excerpt"
          rows={2}
          className={inputClass}
          value={values.excerpt}
          onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="category">
            카테고리
          </label>
          <select
            id="category"
            className={inputClass}
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value as CategorySlug }))}
          >
            {!categories.some((c) => c.slug === values.category) && (
              <option value={values.category}>{post?.categoryLabel ?? values.category}</option>
            )}
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="date">
            날짜
          </label>
          <input
            id="date"
            type="date"
            className={inputClass}
            value={values.date}
            onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="tags">
          태그 (쉼표로 구분)
        </label>
        <input
          id="tags"
          className={inputClass}
          placeholder="React, 성능최적화"
          value={values.tags}
          onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="coverImage">
          커버 이미지
        </label>
        <div className="flex items-center gap-4">
          <select
            id="coverImage"
            className={inputClass}
            value={values.coverImage}
            onChange={(e) => setValues((v) => ({ ...v, coverImage: e.target.value }))}
          >
            {availableImages.map((img) => (
              <option key={img} value={img}>
                {img.replace("/images/", "")}
              </option>
            ))}
          </select>
          <div className="relative w-20 h-14 rounded overflow-hidden shrink-0 bg-surface-muted">
            <Image src={values.coverImage} alt="" fill className="object-cover" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + " mb-0"} htmlFor="content">
            본문 (마크다운)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs text-primary hover:underline"
          >
            {showPreview ? "편집으로 돌아가기" : "미리보기"}
          </button>
        </div>
        {showPreview ? (
          <div className="border border-black/15 rounded-md p-6 min-h-[300px]">
            <PostBody content={values.content || "*내용 없음*"} />
          </div>
        ) : (
          <textarea
            id="content"
            required
            rows={16}
            className={`${inputClass} font-mono text-sm`}
            value={values.content}
            onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
          />
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.popular}
            onChange={(e) => setValues((v) => ({ ...v, popular: e.target.checked }))}
          />
          인기글로 표시
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="status"
            checked={values.status === "draft"}
            onChange={() => setValues((v) => ({ ...v, status: "draft" }))}
          />
          초안
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="status"
            checked={values.status === "published"}
            onChange={() => setValues((v) => ({ ...v, status: "published" }))}
          />
          발행
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-black/10">
        <button type="submit" disabled={saving} className="btn-pill bg-black text-white disabled:opacity-50">
          {saving ? "저장 중..." : mode === "create" ? "글 생성" : "저장"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            {deleting ? "삭제 중..." : "이 글 삭제"}
          </button>
        )}
      </div>
    </form>
  );
}
