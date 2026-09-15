"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { signInWithGoogle, signOutOfGoogle } from "@/lib/firebase/googleAuth";

export default function LoginButton() {
  const { user, loading, firebaseReady } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!firebaseReady) {
    return (
      <span className="text-xs text-white/35" title="Firebase 환경변수(.env.local) 설정이 필요합니다">
        로그인 설정 필요
      </span>
    );
  }

  if (loading) {
    return <span className="text-xs text-white/40">로딩 중...</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName ?? "프로필"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        ) : null}
        <span className="text-sm text-white/80">{user.displayName}</span>
        <button
          type="button"
          onClick={async () => {
            setBusy(true);
            await signOutOfGoogle();
            setBusy(false);
          }}
          disabled={busy}
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={async () => {
        setBusy(true);
        try {
          await signInWithGoogle();
        } finally {
          setBusy(false);
        }
      }}
      disabled={busy}
      className="btn-pill btn-pill-white"
    >
      {busy ? "로그인 중..." : "Google로 로그인"}
    </button>
  );
}
