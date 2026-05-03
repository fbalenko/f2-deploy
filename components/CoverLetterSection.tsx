import { MDXRemote } from "next-mdx-remote/rsc";
import { readMdx } from "@/lib/content";
import { mdxComponents } from "./mdx";
import { SectionAnchor } from "./SectionAnchor";
import { CoverLetter } from "./CoverLetter";

function stripH1(src: string): string {
  return src.replace(/^#\s.+\n+/, "");
}

export function CoverLetterSection() {
  const raw = stripH1(readMdx("06-cover-letter"));
  return (
    <section id="section-6" className="mb-20 scroll-mt-24" aria-labelledby="section-6">
      <SectionAnchor id="section-6" number={6} title="Cover Letter" />
      <div className="max-w-reading">
        <p className="mb-2 font-serif text-[15.5px] leading-relaxed text-ink/85">
          Reproduced here for completeness. The cover letter is delivered to F2 separately as a Word/PDF attachment; this is the same text in the same voice, collapsed by default so the brief reads as methodology first.
        </p>
        <CoverLetter>
          <MDXRemote source={raw} components={mdxComponents} />
        </CoverLetter>
      </div>
    </section>
  );
}
