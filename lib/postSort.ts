import type { Post } from "@/types/post";

// 클라이언트 컴포넌트에서도 쓰이는 순수 함수라 firebase-admin을 임포트하는
// lib/posts.ts와 분리해둔다 (그쪽을 클라이언트 번들에 끌고 들어가면 안 됨).
export function sortPosts(list: Post[], sort: "latest" | "popular"): Post[] {
  if (sort === "popular") {
    return [...list].sort((a, b) => Number(b.popular) - Number(a.popular) || b.date.localeCompare(a.date));
  }
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}
