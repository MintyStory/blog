# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Next.js (App Router, TypeScript, Tailwind CSS v4) app. UI is fully built out across all user-facing routes from `sitemap.md`. Post content and categories are a real Firestore-backed CMS (not dummy data) — Google sign-in, per-post view counts, full post CRUD, and full category CRUD (all create/edit/delete) run against Firebase (Auth + Firestore). Admin is scoped to a view-count dashboard (`/admin`), post management (`/admin/posts/**`), and category management (`/admin/categories/**`) — the rest of `sitemap.md`'s admin surface (media library, SEO settings, comment moderation, etc.) is out of scope. `DESIGN.md` is the design-system spec this UI implements; `sitemap.md` is the original full feature/route map (its Firebase/Next.js/Vercel stack section reflects what's now implemented, not still-pending plans).

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
7. 앱에서 Google로 한 번 로그인 → Firestore에 `users/{uid}` 문서 자동 생성됨 → 콘솔에서 그 문서의 `isAdmin` 필드를 수동으로 `true`로 변경 (최초 관리자 지정은 의도적으로 코드로 자동화하지 않음) → `/admin`, `/admin/posts` 접근 가능.
8. `npm run seed:posts` — `data/seedPosts.ts`의 더미 글 12개를 Firestore `posts` 컬렉션에 1회성으로 채워 넣는다 (이미 존재하는 slug는 건너뜀). 새 Firebase 프로젝트를 막 연결했을 때 콘텐츠가 비어있지 않게 하려는 용도.
9. `npm run seed:categories` — `data/seedCategories.ts`의 기본 카테고리 3개(frontend/backend/infra)를 Firestore `categories` 컬렉션에 1회성으로 채워 넣는다. `getAllCategories`는 posts와 달리 Firestore가 설정돼 있으면 빈 컬렉션이어도 그대로 빈 배열을 반환하므로(폴백하지 않음), 새 Firebase 프로젝트를 연결한 직후에는 이 스크립트를 꼭 실행해야 카테고리 페이지/홈 화면이 비지 않는다.

## Architecture

### Content: Firestore-backed, not dummy data

- Posts live in Firestore `posts/{slug}` (doc id = slug), shaped by `types/post.ts#Post`. `lib/posts.ts` (server-only, imports `firebase-admin` — never import it from a client component) is the single data-access layer: `getAllPosts({includeDrafts})`, `getPostBySlug(slug, {includeDrafts})`, `getPostsByCategory`, `getPostsByTag`, `getRelatedPosts`, `getAdjacentPosts`, `getAllTags`, plus the write functions `createPost`/`updatePost`/`deletePost` used only by the admin API routes. If `firebase-admin` isn't configured, every read function transparently falls back to `data/seedPosts.ts` (filtered to `status: "published"` unless `includeDrafts` is set) so the app still renders with content in a Firebase-less dev environment.
- `Post.content` is **sanitized HTML**, not markdown — it's whatever `components/admin/RichTextEditor.tsx` (Tiptap) serializes via `editor.getHTML()`. `data/seedPosts.ts` and every doc already in Firestore were migrated from the old markdown format to HTML once (see git history); if you ever touch content programmatically, make sure it's HTML, not markdown — `PostBody` no longer parses markdown at all.
- Categories live in Firestore `categories/{slug}` (doc id = slug), shaped by `types/category.ts#Category`. `lib/categories.ts` (server-only) is the data-access layer: `getAllCategories()`, `getCategoryMeta(slug)`, plus `createCategory`/`updateCategory`/`deleteCategory` used only by the admin API routes. Unlike `lib/posts.ts`, it only falls back to `data/seedCategories.ts` when `firebase-admin` isn't configured at all — if Firebase *is* configured but the `categories` collection is empty, it returns an empty array (run `npm run seed:categories` after connecting a fresh project, see setup step 9 above). `Post.category` (`types/post.ts#CategorySlug`) is just `string`, not a fixed union — categories are managed like posts, not hardcoded.
- Client components can't reach `lib/posts.ts` directly (server-only). The `/search` page fetches the public `GET /api/posts` route instead (published posts only); the admin post list/editor fetch the token-gated `/api/admin/posts` routes via `hooks/useAdminFetch.ts`.
- View counts remain the other piece of real per-post state: stored in Firestore `postViews/{slug}`, incremented only via `POST /api/views/[slug]` (Admin SDK; client writes are blocked by `firestore.rules`), read server-side via `lib/viewCounts.ts` (`getViewCount`, `getViewCounts`, `getAllViewCounts`).
- Every route that reads posts/views sets `export const dynamic = "force-dynamic"` — content is editable at runtime via `/admin`, so these pages must not be statically cached.
- **Known trap**: `next.config.ts` must list `firebase-admin` in `serverExternalPackages`. Without it, Next's serverless bundler tries to bundle `firebase-admin`'s CJS/ESM-mixed internals and every route using `lib/posts.ts`/`lib/firebase/admin.ts` 500s at request time (`ERR_REQUIRE_ESM`) — `npm run build` still succeeds and `next dev` works fine, since the bundling-related failure only fires when a built function actually runs (Vercel, or a local `next start`), not at compile time. If you add another server-only package with native/mixed module output, check whether it needs the same treatment.
- **Known trap**: dynamic route params (`[slug]`, `[tag]`) arrive percent-encoded when the slug/tag contains non-ASCII (Korean titles produce Korean slugs). Every place that reads `params.slug`/`params.tag` must `decodeURIComponent` it before using it as a Firestore doc id or comparing it — `app/posts/[slug]/page.tsx`, `app/tags/[tag]/page.tsx`, `app/api/views/[slug]/route.ts`, and `app/api/admin/posts/[slug]/route.ts` all do this. Skipping it silently 404s (this shipped broken once already — see git history).

### Firebase split: client vs. admin

- `lib/firebase/client.ts` — browser SDK (Auth, Firestore), used by client components. Exports `isFirebaseConfigured`; everything using it must handle the not-configured case rather than assuming `auth`/`db` are non-null.
- `lib/firebase/admin.ts` — `firebase-admin`, server-only (Route Handlers / Server Components). Never import this from a client component. Exports `isFirebaseAdminConfigured` with the same no-op-when-missing contract.
- Auth state lives in `components/providers/AuthProvider.tsx` (`useAuth()`: `user`, `isAdmin`, `loading`, `firebaseReady`). `isAdmin` is derived (`Boolean(user) && docIsAdmin`), not stored as its own reset-on-logout state — see the comment there if touching it; React's `set-state-in-effect` lint rule is why it's structured that way.
- `loading` intentionally stays `true` until *both* Firebase Auth resolves *and* (if a user is signed in) the `users/{uid}` Firestore doc's first snapshot arrives — `setUser` and the admin-doc-loading flag are set inside the *same* `onAuthStateChanged` callback for that reason. Splitting them into separate effects (one keyed on auth state, one keyed on `user`) reintroduces a real race: on the render where `user` first becomes non-null, `loading` can momentarily read `false` before the Firestore listener has attached, so `AdminGuard` redirects an actual admin away before their `isAdmin` doc value ever arrives. Hit this once already — keep the single-callback structure if you touch this file.

### Admin dashboard security model

`components/admin/AdminGuard.tsx` is a **UX-only** redirect gate (checks `AuthProvider`'s `isAdmin`) — it does not protect data. The actual authorization boundary is `lib/requireAdmin.ts#requireAdmin`, used by every `app/api/admin/**` Route Handler: it verifies a Firebase ID token server-side and checks the `users/{uid}.isAdmin` Firestore flag itself before doing anything via the Admin SDK (which otherwise bypasses `firestore.rules` entirely). If you add another admin-only data source or mutation, call `requireAdmin` in its Route Handler — never rely on `AdminGuard` alone, and never fetch admin-only data (including draft post content) in a Server Component that isn't itself gated this way, since Server Component output ships in the initial HTML regardless of client-side redirects.

### Post CRUD (admin)

- `app/admin/posts/page.tsx` (list), `.../new/page.tsx` (create), `.../[slug]/edit/page.tsx` (edit) are all `AdminGuard`-wrapped, but the actual data fetching is done by client components (`PostsManager`, `PostEditor`) calling the token-gated `/api/admin/posts` routes via `useAdminFetch` — this is deliberate: a draft post's content must never appear in a Server Component's rendered HTML for a non-admin request, so even the edit page's initial load goes through the authenticated API rather than `getPostBySlug` directly.
- `components/admin/PostForm.tsx` is shared by create and edit (`mode` prop); `slug` is always auto-derived from the title via `lib/slugify.ts` and shown as a disabled field — there's no manual slug editing at all, in create or edit mode.
- Cover images are picked from `data/availableImages.ts` (existing `public/images/*.webp` assets) rather than uploaded — there's no Firebase Storage integration (evaluated it for in-body media uploads and decided against it, see the WYSIWYG editor section below). Add new files there (and to `public/images/`) before they can be selected as a cover.

### WYSIWYG editor & in-body media (no file uploads)

- `components/admin/RichTextEditor.tsx` (Tiptap `useEditor` + `EditorContent`) is the post body editor — not a markdown textarea. Its own toolbar (bold/italic/underline/heading/blockquote/align/indent/font family/font size/link/code block/table/hr) calls Tiptap chain commands directly; there's no separate preview mode since the editor already shows the styled result live (it renders with the same `prose-blog` class as the public site).
- `lib/tiptapExtensions.ts` has the non-standard pieces: `Indent` (adds a cumulative `margin-left` attribute to paragraphs/headings — no `sinkListItem`-style built-in for plain-paragraph indent) and two atomic embed nodes, `AudioEmbed` (`<audio controls src>`) and `DocEmbed` (a `data-src`/`data-filename`-carrying `<div>` that renders a Google Docs Viewer `<iframe>` + a download `<a>`). `FontSize`/`FontFamily`/`TextAlign`/`Table`/`Link`/`Image`/`Youtube` are all official `@tiptap/extension-*` packages, not custom.
- **No file upload capability, on purpose.** Firebase Storage was evaluated for this (direct browser-to-Storage upload, like the rest of the app's Firebase-first architecture) but Firebase now requires the project to be on the Blaze (pay-as-you-go) plan to enable Storage at all, even to stay within the free-tier usage caps — the user declined that upgrade. Vercel Blob and Cloudinary were also considered but not pursued (would mean a new account and a different security model than everything else in this codebase). Net result: the "사진"/"파일·음악"/"동영상" toolbar buttons all just `window.prompt()` for a URL — the user has to host the file somewhere themselves (Google Drive, Naver MYBOX, YouTube, etc.) and paste the link. Revisit this if the user ever agrees to Blaze or another storage provider.
- `PostBody.tsx` (public render) never trusts this HTML as-is: `unified().use(rehypeParse).use(rehypeSanitize, schema).use(rehypeSlug).use(rehypeHighlight).use(rehypeStringify)` re-sanitizes on every render (schema in that file extends `rehype-sanitize`'s `defaultSchema` to allow `iframe`/`audio`/`video`/`source`/`u` and `style` on the block-level tags the editor's align/indent/font-size features produce). Order matters: sanitize runs *before* `rehypeSlug`/`rehypeHighlight` so those two only ever add attributes to an already-safe tree, never need their own allowlist entries.
- `lib/markdown.ts#extractToc` (for `TableOfContents`) parses the HTML with `rehype-parse` + `unist-util-visit` looking for `h2`/`h3` elements, and slugs their text with `github-slugger` — the same slugger `rehype-slug` uses internally, which is why the generated `id`s line up with the anchors `extractToc` produces. If you change how one slugs, change the other.

### Category CRUD (admin)

- Mirrors post CRUD exactly, one collection down: `app/admin/categories/page.tsx` (list), `.../new/page.tsx` (create), `.../[slug]/edit/page.tsx` (edit), all `AdminGuard`-wrapped with data fetching done by `CategoriesManager`/`CategoryEditor` calling the token-gated `/api/admin/categories` routes via `useAdminFetch`.
- `components/admin/CategoryForm.tsx` is shared by create/edit; `slug` is immutable after creation (Firestore doc id) and auto-derived from the name via `lib/slugify.ts`.
- Deleting a category does **not** touch posts already assigned to it — their `category`/`categoryLabel` fields are left as-is (a post can end up pointing at a deleted category's slug; `PostForm`'s category `<select>` handles this by showing the post's current category as an extra option even if it's missing from the live list, so editing an orphaned post doesn't silently reassign it).
- Public read access for the category picker/sidebar is `GET /api/categories` (no auth) — used by `PostForm`'s category `<select>` and `Sidebar`'s category submenu, both client components that can't import the server-only `lib/categories.ts` directly.

### Sidebar (not the original overlay menu)

The original `Blog Home.dc.html` design used a full-screen dark overlay menu. This was intentionally changed to a **left-side push-layout sidebar**: `components/providers/SidebarProvider.tsx` holds open/close state, `components/layout/Sidebar.tsx` is the fixed-position panel, and `components/layout/Header.tsx` / `components/layout/PageShell.tsx` both read the same `open` state to shift by the same `SIDEBAR_WIDTH` (`min(380px, 85vw)`) via `margin-left` — keep those three in sync if the width or animation changes.

### Component layout

`components/layout/` (Header, Sidebar, PageShell, Footer, ScrollToTopButton), `components/ui/` (generic primitives: PillButton, CircleIconButton, Eyebrow, SectionHeader, Pagination, TagPill/CategoryPill, Breadcrumb, LargeBgText, SortToggle, Reveal), `components/cards/` (ImageOverlayCard is the base gradient-scrim-over-image card every card variant wraps; PostCard is the one used across list pages), `components/home/` (one component per home page section, ported ~1:1 from `Blog Home.dc.html`'s inline script — same thresholds/easing/math, just as hooks/refs), `components/post/` (post-detail-only pieces: TableOfContents, PostBody, PrevNextNav, RelatedPosts, LikeShareButtons, CommentsSection, ViewCounter), `components/admin/`, `components/auth/`, `components/providers/`.

`hooks/useScrollReveal.ts` + `components/ui/Reveal.tsx` reimplement the original page's `.reveal` IntersectionObserver pattern as a reusable wrapper — used on every page, not just home.

### Design tokens

Tailwind v4 (CSS-first config, no `tailwind.config.ts`) — tokens live in the `@theme` block at the top of `app/globals.css`, mirroring `DESIGN.md`'s color/spacing/easing values (`bg-primary`, `bg-surface-dark`, `ease-out-strong`, etc. are generated utilities from there). Shared non-utility classes (`.btn-pill`, `.btn-circle`, `.eyebrow`, `.container-blog`, `.reveal`, `.prose-blog`) are also defined there under `@layer components`. When adding a new color/spacing value from `DESIGN.md`, add it to `@theme` rather than hardcoding it in a component.

Post bodies are HTML (see the WYSIWYG editor section above), not markdown — `react-markdown`/`remark-gfm` were removed from the project when the editor switched from a markdown textarea to Tiptap.

### Images

Static assets live in `public/images/` (moved there from a former repo-root `images/` folder — Next.js only serves from `public/`). Referenced as `/images/<file>.webp`. New post/category images should follow the existing naming + prompt-documentation convention in `public/images/image-prompts.md`.
