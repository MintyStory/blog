"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import { useAdminFetch } from "@/hooks/useAdminFetch";

export default function CategoriesManager() {
  const adminFetch = useAdminFetch();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch("/api/admin/categories");
        if (!res.ok) throw new Error((await res.json()).error ?? "불러오기 실패");
        const data = await res.json();
        if (!cancelled) setCategories(data.categories);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "알 수 없는 오류");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!categories) return <p className="text-text-sub">불러오는 중...</p>;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link href="/admin/categories/new" className="btn-pill bg-black text-white">
          + 새 카테고리 추가
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-black/15 text-left text-text-sub">
              <th className="py-3 pr-4 font-medium">이름</th>
              <th className="py-3 pr-4 font-medium">Slug</th>
              <th className="py-3 pr-4 font-medium">설명</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.slug} className="relative border-b border-black/8 hover:bg-black/3">
                <td className="py-3 pr-4 font-medium">
                  <Link href={`/admin/categories/${cat.slug}/edit`} className="absolute inset-0" aria-label={`${cat.label} 수정`} />
                  {cat.label}
                </td>
                <td className="py-3 pr-4 text-text-sub">{cat.slug}</td>
                <td className="py-3 pr-4 text-text-sub max-w-xs truncate">{cat.description}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-text-sub">
                  아직 등록된 카테고리가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
