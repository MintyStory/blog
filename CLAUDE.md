# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Next.js (App Router, TypeScript, Tailwind CSS v4) app. UI is fully built out across all user-facing routes from `sitemap.md` (admin excluded except a view-count dashboard, see below) using dummy content data — no CMS/backend for post content. Two features ARE wired to a real backend: Google sign-in and per-post view counts, both via Firebase (Auth + Firestore). `DESIGN.md` is the design-system spec this UI implements; `sitemap.md` is the original full feature/route map (its Firebase/Next.js/Vercel stack section reflects what's now implemented, not still-pending plans).

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build (also runs the TypeScript check)
npm run lint     # ESLint
```

No test suite exists yet.

## Firebase setup (required for login / view counts / admin dashboard to work)

The app runs and builds fine with no Firebase project configured — `lib/firebase/client.ts` and `lib/firebase/admin.ts` both no-op safely when their env vars are missing (login button shows "설정 필요", view counts show 0, `/admin` shows a "not configured" message instead of crashing).

To enable them:
1. Firebase 콘솔에서 프로젝트 생성.
2. Authentication → Sign-in method에서 Google 공급자 활성화.
3. Firestore Database 생성 (production mode).
4. 프로젝트 설정 → 일반 → 내 앱에서 웹 앱 등록, `NEXT_PUBLIC_FIREBASE_*` 값을 `.env.local`에 복사 (`.env.local.example` 참고).
5. 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성, `FIREBASE_ADMIN_*` 값을 `.env.local`에 채움.
6. `firestore.rules`를 Firebase 콘솔 Rules 탭에 붙여넣거나 `firebase deploy --only firestore:rules`로 배포.
7. 앱에서 Google로 한 번 로그인 → Firestore에 `users/{uid}` 문서 자동 생성됨 → 콘솔에서 그 문서의 `isAdmin` 필드를 수동으로 `true`로 변경 (최초 관리자 지정은 의도적으로 코드로 자동화하지 않음) → `/admin` 접근 가능.

## Architecture

### Content vs. real data

- All post/category/tag content is static TypeScript data in `data/posts.ts`, `data/categories.ts`, `data/tags.ts` — no CMS. `data/posts.ts` also exports the query helpers every route uses (`getPostBySlug`, `getPostsByCategory`, `getPostsByTag`, `getRelatedPosts`, `getAdjacentPosts`, `sortPosts`) — reuse these rather than filtering `posts` inline.
- View counts are the one piece of per-post state that's real: stored in Firestore `postViews/{slug}`, incremented only via `POST /api/views/[slug]` (Admin SDK; client writes are blocked by `firestore.rules`), and read server-side per request via `lib/viewCounts.ts` (`getViewCount`, `getViewCounts`, `getAllViewCounts`) — so pages using it can't be fully static even though their content is.

### Firebase split: client vs. admin

- `lib/firebase/client.ts` — browser SDK (Auth, Firestore), used by client components. Exports `isFirebaseConfigured`; everything using it must handle the not-configured case rather than assuming `auth`/`db` are non-null.
- `lib/firebase/admin.ts` — `firebase-admin`, server-only (Route Handlers / Server Components). Never import this from a client component. Exports `isFirebaseAdminConfigured` with the same no-op-when-missing contract.
- Auth state lives in `components/providers/AuthProvider.tsx` (`useAuth()`: `user`, `isAdmin`, `loading`, `firebaseReady`). `isAdmin` is derived (`Boolean(user) && docIsAdmin`), not stored as its own reset-on-logout state — see the comment there if touching it; React's `set-state-in-effect` lint rule is why it's structured that way.

### Admin dashboard security model

`components/admin/AdminGuard.tsx` is a **UX-only** redirect gate (checks `AuthProvider`'s `isAdmin`) — it does not protect data. The actual authorization boundary is `app/api/admin/views/route.ts`, which verifies a Firebase ID token server-side and checks the `users/{uid}.isAdmin` Firestore flag itself before returning data via the Admin SDK (which otherwise bypasses `firestore.rules` entirely). If you add another admin-only data source, follow the same pattern — token-verified Route Handler, not a client-side-gated Server Component — rather than trusting `AdminGuard` alone.

### Sidebar (not the original overlay menu)

The original `Blog Home.dc.html` design used a full-screen dark overlay menu. This was intentionally changed to a **left-side push-layout sidebar**: `components/providers/SidebarProvider.tsx` holds open/close state, `components/layout/Sidebar.tsx` is the fixed-position panel, and `components/layout/Header.tsx` / `components/layout/PageShell.tsx` both read the same `open` state to shift by the same `SIDEBAR_WIDTH` (`min(380px, 85vw)`) via `margin-left` — keep those three in sync if the width or animation changes.

### Component layout

`components/layout/` (Header, Sidebar, PageShell, Footer, ScrollToTopButton), `components/ui/` (generic primitives: PillButton, CircleIconButton, Eyebrow, SectionHeader, Pagination, TagPill/CategoryPill, Breadcrumb, LargeBgText, SortToggle, Reveal), `components/cards/` (ImageOverlayCard is the base gradient-scrim-over-image card every card variant wraps; PostCard is the one used across list pages), `components/home/` (one component per home page section, ported ~1:1 from `Blog Home.dc.html`'s inline script — same thresholds/easing/math, just as hooks/refs), `components/post/` (post-detail-only pieces: TableOfContents, PostBody, PrevNextNav, RelatedPosts, LikeShareButtons, CommentsSection, ViewCounter), `components/admin/`, `components/auth/`, `components/providers/`.

`hooks/useScrollReveal.ts` + `components/ui/Reveal.tsx` reimplement the original page's `.reveal` IntersectionObserver pattern as a reusable wrapper — used on every page, not just home.

### Design tokens

Tailwind v4 (CSS-first config, no `tailwind.config.ts`) — tokens live in the `@theme` block at the top of `app/globals.css`, mirroring `DESIGN.md`'s color/spacing/easing values (`bg-primary`, `bg-surface-dark`, `ease-out-strong`, etc. are generated utilities from there). Shared non-utility classes (`.btn-pill`, `.btn-circle`, `.eyebrow`, `.container-blog`, `.reveal`, `.prose-blog`) are also defined there under `@layer components`. When adding a new color/spacing value from `DESIGN.md`, add it to `@theme` rather than hardcoding it in a component.

Markdown post bodies render via `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-slug` (`components/post/PostBody.tsx`); `lib/markdown.ts#extractToc` parses `##`/`###` lines with `github-slugger` to build matching heading IDs for `TableOfContents` — if you change how headings get slugged in one place, change it in both.

### Images

Static assets live in `public/images/` (moved there from a former repo-root `images/` folder — Next.js only serves from `public/`). Referenced as `/images/<file>.webp`. New post/category images should follow the existing naming + prompt-documentation convention in `public/images/image-prompts.md`.
