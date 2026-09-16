"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/types/post";
import { useAdminFetch } from "@/hooks/useAdminFetch";

export default function PostsManager() {
  const adminFetch = useAdminFetch();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch("/api/admin/posts");
        if (!res.ok) throw new Error((await res.json()).error ?? "불러오기 실패");
        const data = await res.json();
        if (!cancelled) setPosts(data.posts);
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
  if (!posts) return <p className="text-text-sub">불러오는 중...</p>;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link href="/admin/posts/new" className="btn-pill bg-black text-white">
          + 새 글 작성
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-black/15 text-left text-text-sub">
              <th className="py-3 pr-4 font-medium">제목</th>
              <th className="py-3 pr-4 font-medium">카테고리</th>
              <th className="py-3 pr-4 font-medium">날짜</th>
              <th className="py-3 pr-4 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="relative border-b border-black/8 hover:bg-black/3">
                <td className="py-3 pr-4 font-medium max-w-xs truncate">
                  <Link href={`/admin/posts/${post.slug}/edit`} className="absolute inset-0" aria-label={`${post.title} 수정`} />
                  {post.title}
                </td>
                <td className="py-3 pr-4 text-text-sub">{post.categoryLabel}</td>
                <td className="py-3 pr-4 text-text-sub">{post.date.replaceAll("-", ". ")}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === "published" ? "bg-accent/15 text-accent" : "bg-black/8 text-text-sub"
                    }`}
                  >
                    {post.status === "published" ? "발행됨" : "초안"}
                  </span>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-sub">
                  아직 작성된 글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
