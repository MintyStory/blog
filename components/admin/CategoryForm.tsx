"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import type { Category } from "@/types/category";
import { availableImages } from "@/data/availableImages";
import { slugify } from "@/lib/slugify";
import { useAdminFetch } from "@/hooks/useAdminFetch";

const inputClass =
  "w-full border border-black/15 rounded-md px-4 py-2.5 text-[15px] outline-none focus:border-primary transition-colors";
const labelClass = "block text-sm font-bold mb-2";

interface CategoryFormValues {
  slug: string;
  label: string;
  description: string;
  coverImage: string;
}

function toFormValues(category?: Category): CategoryFormValues {
  return {
    slug: category?.slug ?? "",
    label: category?.label ?? "",
    description: category?.description ?? "",
    coverImage: category?.coverImage ?? availableImages[0],
  };
}

export default function CategoryForm({ mode, category }: { mode: "create" | "edit"; category?: Category }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [values, setValues] = useState<CategoryFormValues>(toFormValues(category));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      label: values.label,
      description: values.description,
      coverImage: values.coverImage,
    };

    try {
      if (mode === "create") {
        const res = await adminFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify({ ...payload, slug: values.slug }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "저장 실패");
        router.push("/admin/categories");
        router.refresh();
      } else {
        const res = await adminFetch(`/api/admin/categories/${category!.slug}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "저장 실패");
        router.push("/admin/categories");
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!category) return;
    if (!confirm(`"${category.label}" 카테고리를 삭제할까요? 이 카테고리로 등록된 글은 남아있지만 카테고리 페이지가 사라집니다.`)) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/categories/${category.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      router.push("/admin/categories");
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
        <label className={labelClass} htmlFor="label">
          이름
        </label>
        <input
          id="label"
          required
          className={inputClass}
          value={values.label}
          onChange={(e) => {
            const label = e.target.value;
            setValues((v) => ({
              ...v,
              label,
              slug: mode === "create" && !slugTouched ? slugify(label) : v.slug,
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
        <label className={labelClass} htmlFor="description">
          설명
        </label>
        <textarea
          id="description"
          rows={2}
          className={inputClass}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
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

      <div className="flex items-center gap-3 pt-4 border-t border-black/10">
        <button type="submit" disabled={saving} className="btn-pill bg-black text-white disabled:opacity-50">
          {saving ? "저장 중..." : mode === "create" ? "카테고리 생성" : "저장"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            {deleting ? "삭제 중..." : "이 카테고리 삭제"}
          </button>
        )}
      </div>
    </form>
  );
}
