import "server-only";
import { NextResponse } from "next/server";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

/**
 * 관리자 전용 Route Handler에서 공통으로 쓰는 인증 가드.
 * 성공 시 { uid }를 반환하고, 실패 시 그대로 응답할 수 있는 NextResponse를 반환한다.
 */
export async function requireAdmin(req: Request): Promise<{ uid: string } | NextResponse> {
  if (!isFirebaseAdminConfigured || !adminAuth || !adminDb) {
    return NextResponse.json({ error: "firebase not configured" }, { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  const idToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(idToken)).uid;
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userDoc = await adminDb.collection("users").doc(uid).get();
  if (!userDoc.data()?.isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return { uid };
}

export function isAdminResult(result: { uid: string } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
