import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

// 서버 컴포넌트 전용. Firebase가 설정되지 않은 개발 초기에는 0을 반환한다.

export async function getViewCount(slug: string): Promise<number> {
  if (!isFirebaseAdminConfigured || !adminDb) return 0;
  const snap = await adminDb.collection("postViews").doc(slug).get();
  return (snap.data()?.count as number) ?? 0;
}

export async function getViewCounts(slugs: string[]): Promise<Record<string, number>> {
  if (!isFirebaseAdminConfigured || !adminDb || slugs.length === 0) return {};
  const refs = slugs.map((slug) => adminDb!.collection("postViews").doc(slug));
  const snaps = await adminDb.getAll(...refs);
  const result: Record<string, number> = {};
  snaps.forEach((snap, i) => {
    result[slugs[i]] = (snap.data()?.count as number) ?? 0;
  });
  return result;
}

export async function getAllViewCounts(): Promise<Record<string, number>> {
  if (!isFirebaseAdminConfigured || !adminDb) return {};
  const snap = await adminDb.collection("postViews").get();
  const result: Record<string, number> = {};
  snap.forEach((doc) => {
    result[doc.id] = (doc.data().count as number) ?? 0;
  });
  return result;
}
