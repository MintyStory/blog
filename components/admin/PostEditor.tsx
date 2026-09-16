"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/types/post";
import { useAdminFetch } from "@/hooks/useAdminFetch";
import PostForm from "@/components/admin/PostForm";

export default function PostEditor({ slug }: { slug: string }) {
  const adminFetch = useAdminFetch();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch(`/api/admin/posts/${slug}`);
        if (!res.ok) {
          if (!cancelled) setPost(null);
          return;
        }
        const data = await res.json();
        if (!cancelled) setPost(data.post);
      } catch {
        if (!cancelled) setPost(null);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (post === undefined) return <p className="text-text-sub">불러오는 중...</p>;
  if (post === null) return <p className="text-red-600">글을 찾을 수 없습니다.</p>;

  return <PostForm mode="edit" post={post} />;
}
