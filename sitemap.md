# 개인 블로그 사이트맵 & 기능 정의

## 1. 사용자(방문자) 화면

```
/                          홈 (최신글 목록, 추천/인기글, 카테고리 바로가기)
/posts                     전체 글 목록 (페이지네이션, 정렬: 최신순/인기순)
/posts/[slug]              글 상세 페이지
  ├─ 본문 (마크다운 렌더링, 코드 하이라이팅, 목차 TOC)
  ├─ 태그/카테고리 표시
  ├─ 이전글/다음글 네비게이션
  ├─ 관련 글 추천
  ├─ 댓글 (선택: 자체 구현 or Disqus/utterances/giscus 연동)
  └─ 좋아요/공유 버튼
/categories                카테고리 목록
/categories/[category]     카테고리별 글 목록
/tags                      태그 클라우드/목록
/tags/[tag]                태그별 글 목록
/search                    검색 결과 페이지 (제목/본문/태그 검색)
/about                     소개 페이지 (자기소개, 이력, 연락처)
/archive                   연도/월별 글 아카이브
/rss.xml                   RSS 피드
/sitemap.xml               SEO용 사이트맵
```

### 사용자 화면 주요 기능
- 글 목록/상세 조회 (마크다운 렌더링, 코드블록 문법 강조)
- 카테고리/태그 기반 탐색
- 검색 (클라이언트 사이드 or 서버 검색)
- 다크모드/라이트모드 토글
- 반응형 레이아웃 (모바일 대응)
- 댓글 기능 (Firestore 서브컬렉션에 직접 저장 — 로그인 없이 닉네임+비번 or Firebase Auth 익명/구글 로그인)
- 조회수 카운트 (Firestore 필드 증가, 또는 Cloud Functions로 어뷰징 방지)
- 소셜 공유 (링크 복사, OG 태그 지원)
- RSS 구독
- (선택) 뉴스레터 구독

---

## 2. 관리자 화면

```
/admin/login                관리자 로그인
/admin                       대시보드 (전체 글 수, 조회수 통계, 최근 활동)
/admin/posts                 글 관리 목록 (검색/필터/정렬)
/admin/posts/new             새 글 작성 (마크다운 에디터, 실시간 미리보기)
/admin/posts/[id]/edit        글 수정
/admin/posts/[id]/delete      글 삭제 (확인 모달)
/admin/categories            카테고리 관리 (생성/수정/삭제)
/admin/tags                  태그 관리 (생성/수정/삭제, 미사용 태그 정리)
/admin/comments              댓글 관리 (승인/삭제, 스팸 필터)
/admin/media                 이미지/파일 업로드 관리 (Firebase Storage 기반 미디어 라이브러리)
/admin/settings               블로그 설정 (제목, 소개, SNS 링크, SEO 메타정보)
/admin/seo                    SEO 관리 (사이트 전역 메타태그, robots.txt, sitemap.xml 상태, 검색엔진 등록 확인)
/admin/analytics              방문자 조회 (일별/글별 방문수, 유입경로, 인기글 랭킹)
/admin/drafts                 임시저장 글 목록
```

### 관리자 화면 주요 기능
- 로그인/인증 (Firebase Authentication — 이메일/비번 or 구글 로그인, 단일 관리자 계정만 허용)
- 글 CRUD (작성/수정/삭제/임시저장/발행 예약) — Firestore `posts` 컬렉션
- 마크다운 에디터 + 실시간 미리보기 (예: Toast UI Editor, react-markdown 프리뷰)
- 이미지 업로드 (Firebase Storage, 드래그앤드롭, 업로드 후 URL을 본문에 삽입)
- 카테고리/태그 관리 — Firestore `categories`/`tags` 컬렉션 (또는 posts 문서에 배열 필드로 단순화)
- 발행 상태 관리 (초안/발행/비공개 — `status` 필드)
- 대시보드 통계 (글 수, 조회수, 최근 댓글 등 — Firestore 집계 쿼리)
- SEO 관리 (글별 title/description/OG image 입력, 사이트 전역 메타태그, sitemap.xml/robots.txt 자동 생성)
- 방문자 조회 (일별/글별 조회수 추이, 유입경로, 인기글 순위 — Vercel Analytics 연동 또는 Firestore 로그 집계)

---

## 3. 확정 기술 스택

| 영역 | 선택 |
|---|---|
| 코드 저장소/버전관리 | **GitHub** |
| 프레임워크 | Next.js (App Router) — Vercel과 궁합 좋음, SSG/SSR/ISR 지원 |
| 데이터베이스 | **Firebase Firestore** — posts, categories, tags, comments 컬렉션 |
| 인증(관리자) | **Firebase Authentication** — 이메일/구글 로그인, admin UID 화이트리스트로 접근 제한 |
| 파일/이미지 저장 | **Firebase Storage** |
| 배포/호스팅 | **Vercel** — GitHub 연동 시 push 자동 배포(CI/CD) |
| 스타일 | Tailwind CSS |
| 에디터 | Toast UI Editor 또는 MDX 기반 커스텀 에디터 |
| 댓글 | Firestore 서브컬렉션 자체 구현 (외부 서비스 불필요) |
| 방문자 통계 | Vercel Analytics 또는 Firestore 기반 자체 조회수/방문자 로그 |

### Firestore 데이터 구조 (초안)
```
posts/{postId}
  - title, slug, content(markdown), excerpt
  - category, tags[]
  - status (draft | published)
  - coverImage (Storage URL)
  - viewCount, createdAt, updatedAt, publishedAt

posts/{postId}/comments/{commentId}
  - author, content, createdAt, approved

categories/{categoryId}  - name, slug
tags/{tagId}             - name, slug
settings/site            - title, description, sns links, seo defaults
```

### 배포 흐름
1. GitHub 리포지토리에 Next.js 프로젝트 push
2. Vercel과 GitHub 연동 → main 브랜치 push 시 자동 빌드/배포
3. Firebase 프로젝트 생성 → Firestore, Auth, Storage 활성화
4. Vercel 환경변수에 Firebase 설정값(API Key 등) 등록
5. Firestore 보안 규칙: 읽기는 공개(published 글만), 쓰기는 관리자 UID만 허용

---

## 4. 다음 단계 제안
1. Firebase 프로젝트 생성 (Firestore/Auth/Storage 활성화)
2. Next.js 프로젝트 스캐폴딩 + GitHub 리포지토리 생성
3. Vercel 연동 및 첫 배포(Hello World) 확인, Vercel Analytics 활성화
4. MVP 범위: 글 목록/상세/카테고리/태그/검색 + 관리자 로그인/글쓰기부터 구현
5. SEO(메타태그, sitemap.xml)와 방문자 통계는 MVP 이후 2차 범위로 진행
