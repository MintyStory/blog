"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import CategoryForm from "@/components/admin/CategoryForm";

export default function CategoryEditor({ slug }: { slug: string }) {
  const adminFetch = useAdminFetch();
  const [category, setCategory] = useState<Category | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch(`/api/admin/categories/${slug}`);
        if (!res.ok) {
          if (!cancelled) setCategory(null);
          return;
        }
        const data = await res.json();
        if (!cancelled) setCategory(data.category);
      } catch {
        if (!cancelled) setCategory(null);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (category === undefined) return <p className="text-text-sub">불러오는 중...</p>;
  if (category === null) return <p className="text-red-600">카테고리를 찾을 수 없습니다.</p>;

  return <CategoryForm mode="edit" category={category} />;
}
