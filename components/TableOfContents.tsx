"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "@/lib/site";

const ITEMS = [
  { id: "founders-note", label: "Founder's Note", number: null },
  ...SECTIONS.filter((s) => s.number !== null).map((s) => ({
    id: s.id,
    label: s.title,
    number: s.number,
  })),
];

export function TableOfContents() {
  const [active, setActive] = useState<string>("founders-note");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -65% 0px",
        threshold: [0, 0.1, 0.5, 1],
      },
    );

    ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const list = (
    <ul className="space-y-2.5 font-sans text-[12.5px]">
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => setDrawerOpen(false)}
              className={
                "flex items-baseline gap-2 transition-colors " +
                (isActive ? "text-accent" : "text-muted hover:text-ink")
              }
            >
              <span className="w-6 shrink-0 tabular-nums">
                {item.number !== null ? `§${item.number}` : "—"}
              </span>
              <span className={isActive ? "font-medium" : ""}>{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
          <p className="mb-3 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
            Contents
          </p>
          {list}
        </div>
      </aside>

      {/* Mobile floating toggle */}
      <button
        type="button"
        aria-label="Open table of contents"
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-ink shadow-sm lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] overflow-y-auto bg-paper p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
                Contents
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                className="text-ink"
              >
                <X size={18} />
              </button>
            </div>
            {list}
          </div>
        </div>
      )}
    </>
  );
}
