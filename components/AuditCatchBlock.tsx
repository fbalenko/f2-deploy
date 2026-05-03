import { catches } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";

export function AuditCatches() {
  return (
    <div className="not-prose mt-6 space-y-10">
      {catches.map((c) => (
        <article
          key={c.n}
          className="border-l-[3px] border-accent pl-5 md:pl-6"
        >
          <header className="mb-4">
            <p className="font-sans text-[10.5px] uppercase tracking-[0.12em] text-accent">
              Catch #{c.n}
            </p>
            <h3 className="mt-1 font-serif text-[1.25rem] font-bold leading-snug text-ink">
              Axis {c.axis} ({c.axisName}) FAILURE
            </h3>
          </header>

          {c.whatCatches && (
            <section className="prose-brief mb-5 max-w-reading">
              <h4 className="!mb-2 !mt-0 font-sans !text-[10.5px] !font-medium uppercase tracking-[0.12em] !text-muted">
                What the rubric catches
              </h4>
              <MDXRemote source={c.whatCatches} />
            </section>
          )}

          {c.whyMatters && (
            <section className="prose-brief mb-5 max-w-reading">
              <h4 className="!mb-2 !mt-0 font-sans !text-[10.5px] !font-medium uppercase tracking-[0.12em] !text-muted">
                Why this matters
              </h4>
              <MDXRemote source={c.whyMatters} />
            </section>
          )}

          {c.promptFix && (
            <section className="prose-brief mb-5 max-w-reading">
              <h4 className="!mb-2 !mt-0 font-sans !text-[10.5px] !font-medium uppercase tracking-[0.12em] !text-muted">
                Prompt-side fix
              </h4>
              <MDXRemote source={c.promptFix} />
            </section>
          )}

          {c.ticket && (
            <section>
              <h4 className="mb-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">
                Engineering ticket
              </h4>
              <pre className="overflow-x-auto rounded border border-rule bg-codeBg p-4 font-mono text-[12.5px] leading-relaxed text-ink/90">
                {c.ticket}
              </pre>
            </section>
          )}
        </article>
      ))}
    </div>
  );
}
