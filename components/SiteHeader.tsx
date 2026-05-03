"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-40 bg-paper/95 backdrop-blur-sm transition-colors " +
        (scrolled ? "border-b border-rule" : "border-b border-transparent")
      }
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6 px-5 py-3 md:px-8">
        <a href="#top" className="group flex flex-col leading-tight">
          <span className="font-serif text-[17px] font-semibold tracking-tight text-ink">
            Field Brief
          </span>
          <span className="hidden font-sans text-[11px] uppercase tracking-[0.08em] text-muted md:block">
            {SITE.subtitle}
          </span>
        </a>

        <nav className="flex items-center gap-5 font-sans text-[13px]">
          <a
            href="/pdf"
            className="text-ink underline decoration-rule decoration-1 underline-offset-4 hover:text-accent"
          >
            Download PDF
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="text-ink underline decoration-rule decoration-1 underline-offset-4 hover:text-accent"
          >
            Email Filip
          </a>
        </nav>
      </div>
    </header>
  );
}
