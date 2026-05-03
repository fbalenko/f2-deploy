import { MDXRemote } from "next-mdx-remote/rsc";
import { readMdx } from "@/lib/content";
import { mdxComponents } from "./mdx";
import { SITE } from "@/lib/site";

function stripH1(src: string): string {
  return src.replace(/^#\s.+\n+/, "");
}

export function FoundersNote() {
  const raw = stripH1(readMdx("founders-note"));
  return (
    <section
      id="founders-note"
      aria-labelledby="founders-note-heading"
      className="mb-20 scroll-mt-24"
    >
      <p className="mb-2 font-sans text-[10.5px] uppercase tracking-[0.14em] text-muted">
        Field Brief · {SITE.version} · {SITE.buildDate}
      </p>
      <h1
        id="founders-note-heading"
        className="mb-8 max-w-reading font-serif text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-ink md:text-[2.6rem]"
      >
        A Mid-Market Private Credit Fund's First 90 Days on F2
      </h1>
      <p className="mb-10 font-sans text-[13px] uppercase tracking-[0.1em] text-muted">
        A Field Brief by Filip Balenko
      </p>
      <hr className="mb-10 border-rule" />

      <h2 className="mb-5 max-w-reading font-serif text-[1.45rem] font-semibold leading-tight text-ink">
        Founder's Note
      </h2>
      <div className="prose-brief max-w-reading">
        <MDXRemote source={raw} components={mdxComponents} />
      </div>
    </section>
  );
}
