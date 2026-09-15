"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

// 이 컴포넌트는 UX용 게이트일 뿐이다. 실제 보안 경계는 Firestore 보안 규칙(firestore.rules)이며,
// 이 가드를 우회해도 규칙이 비관리자의 postViews 쓰기/users 문서 열람을 막는다.
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, firebaseReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!firebaseReady || loading) return;
    if (!user || !isAdmin) router.replace("/");
  }, [firebaseReady, loading, user, isAdmin, router]);

  if (!firebaseReady) {
    return <p className="container-blog pt-40 text-text-sub">Firebase가 설정되지 않았습니다 (.env.local 확인).</p>;
  }
  if (loading) {
    return <p className="container-blog pt-40 text-text-sub">로딩 중...</p>;
  }
  if (!user || !isAdmin) {
    return <p className="container-blog pt-40 text-text-sub">관리자만 접근할 수 있습니다. 이동 중...</p>;
  }

  return <>{children}</>;
}
