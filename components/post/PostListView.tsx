"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/types/post";
import { sortPosts } from "@/lib/postSort";
import PostCard from "@/components/cards/PostCard";
import Pagination from "@/components/ui/Pagination";
import SortToggle, { type SortOption } from "@/components/ui/SortToggle";

const PAGE_SIZE = 6;

export default function PostListView({
  posts,
  viewCounts,
  showSort = true,
}: {
  posts: Post[];
  viewCounts: Record<string, number>;
  showSort?: boolean;
}) {
  const [sort, setSort] = useState<SortOption>("latest");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => sortPosts(posts, sort), [posts, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (posts.length === 0) {
    return <p className="text-text-sub py-20 text-center">아직 글이 없습니다.</p>;
  }

  return (
    <div>
      {showSort && (
        <div className="flex justify-end mb-8">
          <SortToggle
            value={sort}
            onChange={(v) => {
              setSort(v);
              setPage(1);
            }}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pageItems.map((post) => (
          <PostCard key={post.slug} post={post} viewCount={viewCounts[post.slug]} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
