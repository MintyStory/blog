export type CategorySlug = "frontend" | "backend" | "infra";

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
}

export const posts: Post[] = [
  {
    slug: "react-rendering",
    title: "React 렌더링 최적화: useMemo와 useCallback의 진짜 사용 시점",
    excerpt: "무분별한 메모이제이션은 오히려 독이 된다. 실제로 효과가 있는 상황만 골라서 적용한 기록.",
    category: "frontend",
    categoryLabel: "Frontend",
    tags: ["React", "성능최적화"],
    coverImage: "/images/popular-react-rendering.webp",
    date: "2026-09-14",
    popular: true,
    content: `## 언제 메모이제이션이 필요한가

리렌더링 자체는 비싸지 않다. 문제는 **비싸진 자식 컴포넌트의 리렌더링**이다.

\`\`\`tsx
const value = useMemo(() => computeExpensive(items), [items]);
\`\`\`

## useCallback은 참조 동일성 때문에만 쓴다

- 자식이 \`React.memo\`로 감싸져 있을 때
- 의존성 배열에 함수가 들어갈 때

그 외에는 대부분 불필요하다.

## 결론

프로파일러로 먼저 측정하고, 병목이 확인된 지점에만 적용하자.`,
  },
  {
    slug: "react-rendering-notes",
    title: "React 렌더링 최적화 공부 노트",
    excerpt: "위 글을 쓰기 전 정리했던 러프한 학습 노트. React DevTools Profiler 사용법 위주.",
    category: "frontend",
    categoryLabel: "Frontend",
    tags: ["React", "성능최적화"],
    coverImage: "/images/latest-react-rendering-notes.webp",
    date: "2026-09-07",
    popular: false,
    content: `## Profiler 탭 읽는 법

커밋마다 렌더링된 컴포넌트와 소요 시간이 표시된다. "Why did this render?" 옵션을 켜두면 원인 추적이 쉬워진다.

## 체크리스트

1. 리스트 렌더링에 안정적인 key를 쓰고 있는가
2. Context 값이 매 렌더마다 새 객체로 생성되지 않는가
3. 불필요하게 깊은 props drilling이 있는가`,
  },
  {
    slug: "typescript-generics",
    title: "타입스크립트 제네릭 완전 정복: 실전 패턴 5가지",
    excerpt: "제네릭을 이해했다고 생각했는데 실무에서 막힌 순간들, 그리고 해결한 패턴 정리.",
    category: "frontend",
    categoryLabel: "Frontend",
    tags: ["TypeScript"],
    coverImage: "/images/popular-typescript-generics.webp",
    date: "2026-09-03",
    popular: true,
    content: `## 1. 조건부 타입으로 오버로드 줄이기

\`\`\`ts
type Result<T> = T extends string ? string[] : T[];
\`\`\`

## 2. \`infer\`로 반환 타입 추출

## 3. 제네릭 기본값

## 4. 유틸리티 타입 조합

## 5. 빌더 패턴에서의 제네릭 체이닝`,
  },
  {
    slug: "typescript-generics-summary",
    title: "타입스크립트 제네릭 정리",
    excerpt: "제네릭 시리즈를 마무리하며 핵심만 압축한 요약 노트.",
    category: "frontend",
    categoryLabel: "Frontend",
    tags: ["TypeScript"],
    coverImage: "/images/latest-typescript-generics.webp",
    date: "2026-09-03",
    popular: false,
    content: `## 핵심 3가지

1. 제네릭은 "타입을 매개변수화"하는 도구다
2. 제약(\`extends\`)으로 안전성을 확보한다
3. 추론에 맡길 수 있으면 명시하지 않는다`,
  },
  {
    slug: "frontend-design-system",
    title: "사내 디자인 시스템을 처음부터 다시 만든 이유",
    excerpt: "컴포넌트가 늘어날수록 일관성이 무너지던 문제를 토큰 기반 설계로 해결한 과정.",
    category: "frontend",
    categoryLabel: "Frontend",
    tags: ["디자인시스템", "React"],
    coverImage: "/images/category-frontend.webp",
    date: "2026-08-20",
    popular: false,
    content: `## 문제

컴포넌트마다 색상 값이 하드코딩되어 있어 테마 변경이 사실상 불가능했다.

## 해결

CSS 커스텀 프로퍼티 + Tailwind 테마 토큰으로 단일 소스를 만들었다.`,
  },
  {
    slug: "api-optimization",
    title: "느린 API를 10배 빠르게: 실제 최적화 기록",
    excerpt: "평균 응답시간 1.2초짜리 API를 120ms까지 줄인 과정을 순서대로 기록했다.",
    category: "backend",
    categoryLabel: "Backend",
    tags: ["API", "성능최적화"],
    coverImage: "/images/popular-api-optimization.webp",
    date: "2026-09-10",
    popular: true,
    content: `## 1. N+1 쿼리 제거

가장 큰 병목은 항상 N+1이다. \`JOIN\`이나 배치 로딩으로 해결.

## 2. 인덱스 재설계

## 3. 응답 캐싱

## 결과

1.2s → 120ms`,
  },
  {
    slug: "api-optimization-notes",
    title: "느린 API 최적화 실험 노트",
    excerpt: "본 최적화 작업 중 시도했다가 실패한 방법들까지 포함한 실험 기록.",
    category: "backend",
    categoryLabel: "Backend",
    tags: ["API", "성능최적화"],
    coverImage: "/images/latest-api-optimization.webp",
    date: "2026-09-10",
    popular: false,
    content: `## 실패한 시도: 무작정 캐시 레이어 추가

캐시 무효화 로직이 더 복잡해져서 오히려 버그가 늘었다.

## 성공한 시도: 쿼리 프로파일링부터

\`EXPLAIN ANALYZE\`로 실제 병목을 먼저 확인한 뒤 접근한 것이 훨씬 효율적이었다.`,
  },
  {
    slug: "database-indexing",
    title: "인덱스를 잘못 걸면 오히려 느려지는 이유",
    excerpt: "쓰기가 많은 테이블에 인덱스를 과하게 걸었다가 겪은 장애 회고.",
    category: "backend",
    categoryLabel: "Backend",
    tags: ["데이터베이스"],
    coverImage: "/images/category-backend.webp",
    date: "2026-08-15",
    popular: false,
    content: `## 증상

읽기는 빨라졌지만 쓰기 지연이 급증했다.

## 원인

인덱스 6개 중 3개가 실제로는 쿼리 플래너에서 쓰이지 않고 있었다.

## 조치

사용되지 않는 인덱스를 제거하고 복합 인덱스로 통합했다.`,
  },
  {
    slug: "cicd-pipeline",
    title: "GitHub Actions로 CI/CD 파이프라인 구축기",
    excerpt: "테스트-빌드-배포를 자동화하며 겪은 시행착오와 최종 워크플로 구성.",
    category: "infra",
    categoryLabel: "Infra",
    tags: ["CI/CD", "GitHub Actions"],
    coverImage: "/images/popular-cicd-pipeline.webp",
    date: "2026-08-28",
    popular: true,
    content: `## 워크플로 구성

\`\`\`yaml
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
\`\`\`

## 캐싱으로 빌드 시간 절반으로 줄이기

## 배포 승인 단계 추가`,
  },
  {
    slug: "cicd-pipeline-notes",
    title: "CI/CD 파이프라인 구축기 (노트)",
    excerpt: "파이프라인 구축 중 정리한 캐시 전략과 실패 알림 설정 메모.",
    category: "infra",
    categoryLabel: "Infra",
    tags: ["CI/CD", "GitHub Actions"],
    coverImage: "/images/latest-cicd-pipeline.webp",
    date: "2026-08-28",
    popular: false,
    content: `## 캐시 키 전략

\`package-lock.json\` 해시를 캐시 키에 포함시켜 의존성 변경 시에만 캐시를 무효화했다.

## 실패 알림

Slack 웹훅으로 실패한 job만 알림.`,
  },
  {
    slug: "deployment-automation",
    title: "배포 자동화 구축기: Terraform부터 ArgoCD까지",
    excerpt: "수동 배포로 인한 사고를 겪은 뒤 GitOps 기반으로 전면 재구성한 기록.",
    category: "infra",
    categoryLabel: "Infra",
    tags: ["Terraform", "ArgoCD", "GitOps"],
    coverImage: "/images/latest-deployment-automation.webp",
    date: "2026-09-14",
    popular: false,
    content: `## Terraform으로 인프라 코드화

## ArgoCD로 선언적 배포

Git 저장소의 상태가 곧 클러스터의 상태가 되도록 구성했다.

## 얻은 것

배포 이력이 전부 git log로 추적 가능해졌다.`,
  },
  {
    slug: "side-project-retrospective",
    title: "사이드 프로젝트 1년 회고: 잘한 것과 아쉬운 것",
    excerpt: "1년간 혼자 운영한 사이드 프로젝트를 마무리하며 남기는 솔직한 회고.",
    category: "infra",
    categoryLabel: "Infra",
    tags: ["회고"],
    coverImage: "/images/popular-side-project-retrospective.webp",
    date: "2026-07-30",
    popular: true,
    content: `## 잘한 것

- 작게 시작해서 빠르게 배포한 것
- 사용자 피드백을 바로 반영한 것

## 아쉬운 것

- 테스트 코드를 너무 늦게 도입한 것
- 인프라 비용 모니터링을 소홀히 한 것`,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return posts.filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags.includes(tag));
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, limit);
}

export function getAdjacentPosts(post: Post): { prev: Post | null; next: Post | null } {
  const sorted = [...posts].sort((a, b) => a.date.localeCompare(b.date));
  const index = sorted.findIndex((p) => p.slug === post.slug);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export function sortPosts(list: Post[], sort: "latest" | "popular"): Post[] {
  if (sort === "popular") {
    return [...list].sort((a, b) => Number(b.popular) - Number(a.popular) || b.date.localeCompare(a.date));
  }
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}
