import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

// 공개 읽기 전용 — 발행된 글만 반환한다. 검색 페이지(클라이언트 컴포넌트)가 사용.
export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}
