"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function update() {
      const section = sectionRef.current;
      const bg = bgRef.current;
      if (!section || !bg) return;
      const rect = section.getBoundingClientRect();
      const wh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (wh - rect.top) / (wh + rect.height)));
      const r = Math.round(255 - (255 - 169) * progress);
      const g = Math.round(255 - (255 - 193) * progress);
      const b = Math.round(255 - (255 - 245) * progress);
      bg.style.background = `linear-gradient(180deg, rgb(${r},${g},${b}) 0%, #A9C1F5 100%)`;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-[160px] text-center overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 bg-white" />
      <div className="container-blog relative z-10">
        <Reveal>
          <Eyebrow>뉴스레터</Eyebrow>
          <h2 className="text-[32px] md:text-[48px] font-extrabold leading-[1.15] tracking-[-0.025em] mb-4.5">
            새 글이 올라오면
            <br />
            바로 알려드릴게요
          </h2>
          <p className="text-base text-text-sub mb-12">스팸 없이, 새 글이 발행될 때만 연락드려요.</p>
          {submitted ? (
            <p className="btn-pill inline-flex">구독 완료!</p>
          ) : (
            <form
              className="flex gap-3 justify-center flex-wrap"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
              }}
            >
              <input
                type="email"
                required
                placeholder="이메일 주소를 입력하세요"
                aria-label="이메일 주소"
                className="border border-black/20 rounded-full px-6 py-3 text-[15px] w-[300px] max-w-full outline-none bg-white/70 focus:border-primary focus:bg-white transition-colors"
              />
              <button type="submit" className="btn-pill !py-3 !px-7 !text-[15px]">
                구독하기 &rarr;
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
