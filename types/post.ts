export type CategorySlug = "frontend" | "backend" | "infra";

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
