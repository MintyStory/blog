"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white border border-black/12 flex items-center justify-center text-lg cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5 pointer-events-none"
      }`}
    >
      &#8593;
    </button>
  );
}
