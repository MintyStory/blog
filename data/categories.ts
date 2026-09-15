import type { CategorySlug } from "./posts";

export interface CategoryMeta {
  slug: CategorySlug;
  label: string;
  description: string;
  coverImage: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: "frontend",
    label: "Frontend",
    description: "React, TypeScript, 성능 최적화",
    coverImage: "/images/category-frontend.webp",
  },
  {
    slug: "backend",
    label: "Backend",
    description: "API 설계, 데이터베이스, 서버 아키텍처",
    coverImage: "/images/category-backend.webp",
  },
  {
    slug: "infra",
    label: "Infra",
    description: "CI/CD, Docker, 클라우드 인프라",
    coverImage: "/images/category-infra.webp",
  },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}
