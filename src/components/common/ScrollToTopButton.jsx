"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="ឡើងទៅខាងលើវិញ"
      title="ឡើងលើរហ័ស"
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 rounded-full border border-[#fdbcbc] bg-[#db073d] px-3.5 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#bb0533] hover:shadow-xl active:scale-95 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
          : "pointer-events-none translate-y-4 opacity-0 scale-90"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
      <span className="hidden sm:inline">ឡើងលើ</span>
    </button>
  );
}
