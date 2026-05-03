"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Prompt } from "@/lib/content";

function ListBlock({ raw }: { raw: string | null }) {
  if (!raw) return null;
  // Render as plain markdown-ish: split bullet lines on "- " or numbered "1."
  const lines = raw.split("\n").filter((l) => l.trim().length);
  const isNumbered = /^\d+\.\s/.test(lines[0] ?? "");
  const Tag = isNumbered ? "ol" : "ul";
  const items: { label: string; body: string }[] = [];
  let current: { label: string; body: string } | null = null;
  for (const line of lines) {
    if (/^(\d+\.|[-*])\s/.test(line)) {
      if (current) items.push(current);
      const stripped = line.replace(/^(\d+\.|[-*])\s/, "");
      current = { label: stripped, body: "" };
    } else if (current) {
      current.body += (current.body ? " " : "") + line.trim();
    }
  }
  if (current) items.push(current);

  return (
    <Tag className={`mt-2 list-${isNumbered ? "decimal" : "disc"} space-y-1.5 pl-5 text-[15px] leading-relaxed`}>
      {items.map((it, i) => (
        <li key={i}>
          <Inline text={it.label} />
          {it.body && (
            <span className="block text-muted">
              <Inline text={it.body} />
            </span>
          )}
        </li>
      ))}
    </Tag>
  );
}

function Inline({ text }: { text: string }) {
  // Bold ** ** and italic * *
  const parts: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      parts.push(
        <code key={key++} className="rounded bg-codeBg px-1 py-0.5 font-mono text-[0.85em]">
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      parts.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      id={`prompt-${prompt.n}`}
      className="border border-rule bg-paper transition-colors hover:border-ink/30"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-col gap-3 px-5 py-4 text-left md:px-6 md:py-5"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-[1.18rem] font-semibold leading-snug text-ink">
            {prompt.title}
          </h3>
          <span className="shrink-0 whitespace-nowrap font-sans text-[10.5px] uppercase tracking-[0.1em] text-accent">
            {prompt.tierLabel}
          </span>
        </div>

        {prompt.useCase && (
          <p className="font-serif text-[15.5px] leading-relaxed text-ink/85">
            <span className="font-semibold text-ink">Use case. </span>
            <Inline text={prompt.useCase} />
          </p>
        )}

        <span className="mt-1 inline-flex items-center gap-1 font-sans text-[12px] text-muted">
          <ChevronDown
            size={14}
            className={"transition-transform " + (open ? "rotate-180" : "")}
          />
          {open ? "Hide details" : "Show prompt, edge cases, audit checklist"}
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-rule px-5 py-5 md:px-6 md:py-6">
            {prompt.whyMatters && (
              <section className="mb-5">
                <h4 className="mb-1.5 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  Why this prompt matters at deployment
                </h4>
                <p className="font-serif text-[15.5px] leading-relaxed">
                  <Inline text={prompt.whyMatters} />
                </p>
              </section>
            )}

            {prompt.promptBody && (
              <section className="mb-5">
                <h4 className="mb-1.5 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  The prompt
                </h4>
                <pre className="overflow-x-auto rounded border border-rule bg-codeBg p-4 font-mono text-[12.5px] leading-relaxed">
                  {prompt.promptBody}
                </pre>
              </section>
            )}

            {prompt.expectedOutput && (
              <section className="mb-5">
                <h4 className="mb-1.5 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  Expected output shape
                </h4>
                <p className="font-serif text-[15.5px] leading-relaxed">
                  <Inline text={prompt.expectedOutput} />
                </p>
              </section>
            )}

            {prompt.edgeCases && (
              <section className="mb-5">
                <h4 className="mb-1.5 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  Edge cases
                </h4>
                <ListBlock raw={prompt.edgeCases} />
              </section>
            )}

            {prompt.auditChecklist && (
              <section>
                <h4 className="mb-1.5 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  Audit checklist
                </h4>
                <ListBlock raw={prompt.auditChecklist} />
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
