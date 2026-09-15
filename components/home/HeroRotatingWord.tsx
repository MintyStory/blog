"use client";

import { useEffect, useRef } from "react";

const WORDS = ["생각", "배움", "경험", "성장", "기록"];

export default function HeroRotatingWord() {
  const wordRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % WORDS.length;
      const wrapper = wrapperRef.current;
      const word = wordRef.current;
      if (!wrapper || !word) return;
      wrapper.classList.remove("animating");
      void wrapper.offsetWidth; // force reflow
      word.textContent = WORDS[idxRef.current];
      wrapper.classList.add("animating");
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      ref={wrapperRef}
      className="text-primary-light inline-block relative [&.animating_.word-inner]:animate-[wordIn_.45s_var(--ease-out-strong)_both]"
    >
      <span ref={wordRef} className="word-inner inline-block">
        생각
      </span>
    </span>
  );
}
