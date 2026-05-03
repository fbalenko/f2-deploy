"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CoverLetter({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose my-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 border border-rule bg-paper px-5 py-3 font-sans text-[13px] text-ink hover:border-ink/40"
      >
        <ChevronDown
          size={14}
          className={"transition-transform " + (open ? "rotate-180" : "")}
        />
        {open ? "Hide cover letter" : "Read the cover letter"}
      </button>

      {open && (
        <article className="mx-auto mt-6 max-w-[640px] border border-rule bg-paper px-7 py-10 md:px-12 md:py-14">
          <header className="mb-8 border-b border-rule pb-5">
            <p className="font-serif text-[1.05rem] font-semibold tracking-tight text-ink">
              Filip Balenko
            </p>
            <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-muted">
              Application — F2 AI Deployment Strategist
            </p>
          </header>
          <div className="prose-brief font-serif text-[15.5px] leading-[1.75]">
            {children}
          </div>
        </article>
      )}
    </div>
  );
}
