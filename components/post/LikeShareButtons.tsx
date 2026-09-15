"use client";

import { useState } from "react";

export default function LikeShareButtons() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-3 mt-10">
      <button
        type="button"
        onClick={() => {
          setLiked((v) => !v);
          setLikeCount((c) => c + (liked ? -1 : 1));
        }}
        aria-pressed={liked}
        className={`btn-circle ${liked ? "bg-black text-white" : "text-black"}`}
        title="좋아요"
      >
        {liked ? "♥" : "♡"}
      </button>
      <span className="text-sm text-text-sub">{likeCount}</span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // 클립보드 권한이 없는 환경 — 조용히 무시
          }
        }}
        className="btn-circle text-black"
        title="링크 복사"
      >
        &#128279;
      </button>
      {copied && <span className="text-xs text-text-sub">링크가 복사되었습니다</span>}
    </div>
  );
}
