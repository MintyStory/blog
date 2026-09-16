import "server-only";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { seedCategories } from "@/data/seedCategories";
import type { Category } from "@/types/category";

const COLLECTION = "categories";

function fromDoc(id: string, data: FirebaseFirestore.DocumentData): Category {
  return {
    slug: id,
    label: data.label,
    description: data.description,
    coverImage: data.coverImage,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    return seedCategories;
  }

  const snap = await adminDb.collection(COLLECTION).get();
  return snap.docs.map((doc) => fromDoc(doc.id, doc.data()));
}

export async function getCategoryMeta(slug: string): Promise<Category | undefined> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug);
}

export interface CategoryInput {
  label: string;
  description: string;
  coverImage: string;
}

/** 관리자 API(app/api/admin/categories/**)에서만 호출 — ID 토큰+isAdmin 검증 후 사용. */
export async function createCategory(slug: string, input: CategoryInput): Promise<void> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    throw new Error("Firebase가 설정되지 않아 카테고리를 저장할 수 없습니다.");
  }
  const ref = adminDb.collection(COLLECTION).doc(slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error("이미 같은 slug의 카테고리가 존재합니다.");
  }
  await ref.set(input);
}

export async function updateCategory(slug: string, input: CategoryInput): Promise<void> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    throw new Error("Firebase가 설정되지 않아 카테고리를 저장할 수 없습니다.");
  }
  await adminDb.collection(COLLECTION).doc(slug).set(input);
}

export async function deleteCategory(slug: string): Promise<void> {
  if (!isFirebaseAdminConfigured || !adminDb) {
    throw new Error("Firebase가 설정되지 않아 카테고리를 삭제할 수 없습니다.");
  }
  await adminDb.collection(COLLECTION).doc(slug).delete();
}
