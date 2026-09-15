"use client";

import { useMemo, useState } from "react";
import { posts } from "@/data/posts";
import PostCard from "@/components/cards/PostCard";
import Eyebrow from "@/components/ui/Eyebrow";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container-blog">
        <div className="mb-11 text-center">
          <Eyebrow>Search</Eyebrow>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em] mb-8">검색</h1>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 본문, 태그로 검색하세요"
            aria-label="검색어"
            className="border border-black/20 rounded-full px-6 py-3.5 text-[15px] w-full max-w-[480px] outline-none focus:border-primary transition-colors"
          />
        </div>

        {query.trim() === "" ? (
          <p className="text-center text-text-sub py-12">검색어를 입력해보세요.</p>
        ) : results.length === 0 ? (
          <p className="text-center text-text-sub py-12">&quot;{query}&quot;에 대한 검색 결과가 없습니다.</p>
        ) : (
          <>
            <p className="text-sm text-text-sub mb-6">{results.length}개의 결과</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {results.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
