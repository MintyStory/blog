"use client";

import { useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

/** 관리자 API 호출용 fetch 래퍼 — 현재 로그인된 사용자의 ID 토큰을 Authorization 헤더에 자동으로 붙인다. */
export function useAdminFetch() {
  const { user } = useAuth();

  return useCallback(
    async (input: string, init: RequestInit = {}) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      const idToken = await user.getIdToken();
      return fetch(input, {
        ...init,
        headers: {
          ...(init.body ? { "Content-Type": "application/json" } : {}),
          ...init.headers,
          Authorization: `Bearer ${idToken}`,
        },
      });
    },
    [user],
  );
}
