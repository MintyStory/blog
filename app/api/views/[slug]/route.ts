import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { getPostBySlug } from "@/lib/posts";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  if (!(await getPostBySlug(slug))) {
    return NextResponse.json({ error: "post not found" }, { status: 404 });
  }
  if (!isFirebaseAdminConfigured || !adminDb) {
    return NextResponse.json({ ok: false, reason: "firebase not configured" }, { status: 200 });
  }

  await adminDb
    .collection("postViews")
    .doc(slug)
    .set({ count: FieldValue.increment(1) }, { merge: true });

  return NextResponse.json({ ok: true });
}
