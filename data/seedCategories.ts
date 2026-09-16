import type { Category } from "@/types/category";

export const seedCategories: Category[] = [
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
