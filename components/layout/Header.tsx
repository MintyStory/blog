"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/providers/SidebarProvider";

export default function Header() {
  const pathname = usePathname();
  const hasDarkHero = pathname === "/";
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { toggle, open } = useSidebar();
  const SIDEBAR_WIDTH = "min(380px, 85vw)";

  useEffect(() => {
    if (!hasDarkHero) return;
    function onScroll() {
      const y = window.scrollY;
      setScrolledPastHero(y > 60);
      setHidden(y > lastY.current && y > 220);
      lastY.current = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasDarkHero]);

  useEffect(() => {
    if (hasDarkHero) return;
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 220);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasDarkHero]);

  const scrolled = !hasDarkHero || scrolledPastHero;

  return (
    <header
      style={{ marginLeft: open ? SIDEBAR_WIDTH : 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 lg:px-20 transition-[background,box-shadow,transform,margin-left] duration-300 ${
        scrolled ? "bg-white/96 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""
      } ${hidden ? "-translate-y-full" : ""}`}
    >
      <div className="flex items-center gap-4 h-[72px]">
        <button
          type="button"
          onClick={toggle}
          aria-label="메뉴 열기"
          aria-expanded={open}
          className="flex flex-col justify-center gap-[6px] w-8 h-8 p-1 bg-transparent border-none cursor-pointer"
        >
          <span
            className={`block h-[1.5px] rounded-sm transition-colors ${scrolled ? "bg-black" : "bg-white"}`}
          />
          <span
            className={`block h-[1.5px] rounded-sm transition-colors ${scrolled ? "bg-black" : "bg-white"}`}
          />
        </button>
        <Link
          href="/"
          className={`text-[17px] font-extrabold tracking-[0.06em] transition-colors ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          DEV LOG
        </Link>
      </div>
    </header>
  );
}
