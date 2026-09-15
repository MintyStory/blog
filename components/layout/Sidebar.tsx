"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoginButton from "@/components/auth/LoginButton";
import { useSidebar } from "@/components/providers/SidebarProvider";

const SIDEBAR_WIDTH = "min(380px, 85vw)";

export default function Sidebar() {
  const { open, close } = useSidebar();
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="내비게이션 메뉴"
      aria-hidden={!open}
      style={{ width: SIDEBAR_WIDTH }}
      className={`fixed top-0 left-0 bottom-0 z-[200] bg-surface-dark flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between h-[72px] px-6 border-b border-white/8 shrink-0">
        <span className="text-[17px] font-extrabold text-white tracking-[0.06em]">DEV LOG</span>
        <button
          type="button"
          onClick={close}
          aria-label="메뉴 닫기"
          className="flex items-center justify-center p-1 bg-transparent border-none cursor-pointer text-white/70 hover:text-white transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pt-8">
        <ul className="list-none">
          <li className="border-b border-white/7">
            <Link href="/about" onClick={close} className="flex items-center py-4 text-lg font-bold text-white hover:text-primary-light transition-colors">
              소개
            </Link>
          </li>
          <li className="border-b border-white/7">
            <button
              type="button"
              onClick={() => setCategoryOpen((v) => !v)}
              aria-expanded={categoryOpen}
              className="flex items-center justify-between w-full py-4 text-lg font-bold text-white bg-transparent border-none cursor-pointer text-left hover:text-primary-light transition-colors"
            >
              카테고리
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${categoryOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <ul
              className={`list-none overflow-hidden transition-[max-height] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                categoryOpen ? "max-h-60" : "max-h-0"
              }`}
              aria-hidden={!categoryOpen}
            >
              {[
                { href: "/categories/frontend", label: "Frontend" },
                { href: "/categories/backend", label: "Backend" },
                { href: "/categories/infra", label: "Infra" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block py-2.5 pl-3 text-[15px] text-white/75 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {[
            { href: "/posts", label: "전체 글" },
            { href: "/tags", label: "태그" },
            { href: "/archive", label: "아카이브" },
            { href: "/search", label: "검색" },
          ].map((item) => (
            <li key={item.href} className="border-b border-white/7">
              <Link href={item.href} onClick={close} className="flex items-center py-4 text-lg font-bold text-white hover:text-primary-light transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 pb-8 pt-6 border-t border-white/8 shrink-0 space-y-4">
        <LoginButton />
        <div className="flex gap-5">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/65 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="/rss.xml" className="text-xs text-white/65 hover:text-white transition-colors">
            RSS
          </a>
        </div>
      </div>
    </aside>
  );
}
