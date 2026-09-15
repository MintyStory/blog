"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

interface Row {
  slug: string;
  title: string;
  categoryLabel: string;
  date: string;
  viewCount: number;
}

type SortKey = "viewCount" | "date";

export default function ViewsDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("viewCount");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/admin/views", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "요청 실패");
        const data = await res.json();
        if (!cancelled) setRows(data.rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "알 수 없는 오류");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!rows) return <p className="text-text-sub">불러오는 중...</p>;

  const sorted = [...rows].sort((a, b) =>
    sortKey === "viewCount" ? b.viewCount - a.viewCount : b.date.localeCompare(a.date),
  );
  const totalViews = rows.reduce((sum, r) => sum + r.viewCount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-sub">총 조회수 {totalViews.toLocaleString()} &middot; 글 {rows.length}개</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSortKey("viewCount")}
            className={`btn-pill !py-2 !px-4 !text-xs ${sortKey === "viewCount" ? "bg-black text-white" : ""}`}
          >
            조회수순
          </button>
          <button
            type="button"
            onClick={() => setSortKey("date")}
            className={`btn-pill !py-2 !px-4 !text-xs ${sortKey === "date" ? "bg-black text-white" : ""}`}
          >
            최신순
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-black/15 text-left text-text-sub">
              <th className="py-3 pr-4 font-medium">제목</th>
              <th className="py-3 pr-4 font-medium">카테고리</th>
              <th className="py-3 pr-4 font-medium">발행일</th>
              <th className="py-3 pr-4 font-medium text-right">조회수</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.slug} className="border-b border-black/8">
                <td className="py-3 pr-4 font-medium max-w-xs truncate">{row.title}</td>
                <td className="py-3 pr-4 text-text-sub">{row.categoryLabel}</td>
                <td className="py-3 pr-4 text-text-sub">{row.date.replaceAll("-", ". ")}</td>
                <td className="py-3 pr-4 text-right font-bold">{row.viewCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
