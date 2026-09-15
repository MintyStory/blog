import { NextResponse } from "next/server";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { posts } from "@/data/posts";
import { getAllViewCounts } from "@/lib/viewCounts";

export async function GET(req: Request) {
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

  const viewCounts = await getAllViewCounts();
  const rows = posts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      categoryLabel: post.categoryLabel,
      date: post.date,
      viewCount: viewCounts[post.slug] ?? 0,
    }))
    .sort((a, b) => b.viewCount - a.viewCount);

  return NextResponse.json({ rows });
}
