/** 카테고리는 Firestore `categories` 컬렉션에서 관리자가 자유롭게 추가/삭제한다 — 고정된 값 목록이 아니다. */
export type CategorySlug = string;

export type PostStatus = "draft" | "published";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  categoryLabel: string;
  tags: string[];
  coverImage: string;
  date: string; // "2026-09-14"
  content: string; // markdown
  popular: boolean;
  status: PostStatus;
}
