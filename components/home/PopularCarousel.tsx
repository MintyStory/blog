"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/posts";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

export default function PopularCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, t: 0 });

  function cardWidth() {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-carousel-card]");
    if (!card) return 0;
    return card.getBoundingClientRect().width + 20;
  }

  function clamp(val: number) {
    const track = trackRef.current;
    if (!track || !track.parentElement) return 0;
    const max = -(track.scrollWidth - track.parentElement.offsetWidth + 80);
    return Math.min(0, Math.max(max, val));
  }

  function setTranslate(val: number, animate: boolean) {
    const track = trackRef.current;
    if (!track) return;
    translateRef.current = clamp(val);
    track.style.transition = animate ? "transform .5s cubic-bezier(0.16,1,0.3,1)" : "none";
    track.style.transform = `translateX(${translateRef.current}px)`;
  }

  return (
    <section className="py-20 md:py-[140px] overflow-hidden">
      <div className="container-blog">
        <Reveal className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-11">
          <div>
            <Eyebrow>Popular Posts</Eyebrow>
            <h2 className="text-[30px] md:text-[40px] font-extrabold leading-[1.18] tracking-[-0.02em]">많이 읽은 글</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="이전"
              onClick={() => setTranslate(translateRef.current + cardWidth(), true)}
              className="btn-circle text-black hover:bg-black hover:text-white"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="다음"
              onClick={() => setTranslate(translateRef.current - cardWidth(), true)}
              className="btn-circle text-black hover:bg-black hover:text-white"
            >
              &rarr;
            </button>
          </div>
        </Reveal>
      </div>
      <div className="overflow-hidden pl-6 md:pl-12 lg:pl-20">
        <div
          ref={trackRef}
          className={`flex gap-5 select-none will-change-transform ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={(e) => {
            setDragging(true);
            dragStart.current = { x: e.clientX, t: translateRef.current };
          }}
          onMouseMove={(e) => {
            if (!dragging) return;
            setTranslate(dragStart.current.t + (e.clientX - dragStart.current.x), false);
          }}
          onMouseUp={(e) => {
            if (!dragging) return;
            setDragging(false);
            const dx = e.clientX - dragStart.current.x;
            setTranslate(Math.abs(dx) > 60 ? translateRef.current : dragStart.current.t, true);
          }}
          onMouseLeave={() => {
            if (dragging) {
              setDragging(false);
              setTranslate(dragStart.current.t, true);
            }
          }}
          onTouchStart={(e) => {
            dragStart.current = { x: e.touches[0].clientX, t: translateRef.current };
          }}
          onTouchMove={(e) => {
            setTranslate(dragStart.current.t + (e.touches[0].clientX - dragStart.current.x), false);
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - dragStart.current.x;
            setTranslate(Math.abs(dx) > 60 ? translateRef.current : dragStart.current.t, true);
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              data-carousel-card
              className="group relative flex-none w-[80%] sm:w-[calc(33%-14px)] lg:w-[calc(25%-15px)] aspect-[4/5] overflow-hidden rounded"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1100px) 25vw, (min-width: 640px) 33vw, 80vw"
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-40% to-black/68" />
              <div className="absolute bottom-0 left-0 right-0 z-10 p-[22px]">
                <p className="text-[10px] font-semibold tracking-[0.07em] uppercase text-white/60 mb-1.5">{post.categoryLabel}</p>
                <h3 className="text-[15px] font-bold text-white leading-[1.4]">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
