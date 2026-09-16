import "server-only";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { seedPosts } from "@/data/seedPosts";
import type { CategorySlug, Post } from "@/types/post";
import { sortPosts } from "@/lib/postSort";

export { sortPosts };

const COLLECTION = "posts";

function fromDoc(id: string, data: FirebaseFirestore.DocumentData): Post {
  return {
    slug: id,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    categoryLabel: data.categoryLabel,
    tags: data.tags ?? [],
    coverImage: data.coverImage,
    date: data.date,
    content: data.content,
    popular: Boolean(data.popular),
    status: data.status === "draft" ? "draft" : "published",
  };
}

/** includeDrafts는 관리자 화면에서만 true로 넘긴다. */
export async function getAllPosts({ includeDrafts = false } = {}): Promise<Post[]> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    const list = includeDrafts ? seedPosts : seedPosts.filter((p) => p.status === "published");
    return sortPosts(list, "latest");
  }

  const snap = await adminDb.collection(COLLECTION).get();
  const list = snap.docs
    .map((doc) => fromDoc(doc.id, doc.data()))
    .filter((p) => includeDrafts || p.status === "published");
  return sortPosts(list, "latest");
}

export async function getPostBySlug(slug: string, { includeDrafts = false } = {}): Promise<Post | null> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    const post = seedPosts.find((p) => p.slug === slug);
    if (!post) return null;
    if (!includeDrafts && post.status !== "published") return null;
    return post;
  }

  const doc = await adminDb.collection(COLLECTION).doc(slug).get();
  if (!doc.exists) return null;
  const post = fromDoc(doc.id, doc.data()!);
  if (!includeDrafts && post.status !== "published") return null;
  return post;
}

export async function getPostsByCategory(category: CategorySlug): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === category);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.tags.includes(tag));
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, limit);
}

export async function getAdjacentPosts(post: Post): Promise<{ prev: Post | null; next: Post | null }> {
  const all = await getAllPosts();
  const sorted = [...all].sort((a, b) => a.date.localeCompare(b.date));
  const index = sorted.findIndex((p) => p.slug === post.slug);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export interface TagMeta {
  tag: string;
  count: number;
}

export async function getAllTags(): Promise<TagMeta[]> {
  const all = await getAllPosts();
  const counts = new Map<string, number>();
  for (const post of all) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export interface PostInput {
  title: string;
  excerpt: string;
  category: CategorySlug;
  categoryLabel: string;
  tags: string[];
  coverImage: string;
  date: string;
  content: string;
  popular: boolean;
  status: "draft" | "published";
}

/** 관리자 API(app/api/admin/posts/**)에서만 호출 — ID 토큰+isAdmin 검증 후 사용. */
export async function createPost(slug: string, input: PostInput): Promise<void> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    throw new Error("Firebase가 설정되지 않아 글을 저장할 수 없습니다.");
  }
  const ref = adminDb.collection(COLLECTION).doc(slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error("이미 같은 slug의 글이 존재합니다.");
  }
  await ref.set(input);
}

export async function updatePost(slug: string, input: PostInput): Promise<void> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    throw new Error("Firebase가 설정되지 않아 글을 저장할 수 없습니다.");
  }
  await adminDb.collection(COLLECTION).doc(slug).set(input);
}

export async function deletePost(slug: string): Promise<void> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    throw new Error("Firebase가 설정되지 않아 글을 삭제할 수 없습니다.");
  }
  await adminDb.collection(COLLECTION).doc(slug).delete();
}
