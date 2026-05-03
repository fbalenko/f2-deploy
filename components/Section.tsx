import { MDXRemote } from "next-mdx-remote/rsc";
import { readMdx } from "@/lib/content";
import { mdxComponents } from "./mdx";
import { SectionAnchor } from "./SectionAnchor";

function stripH1(src: string): string {
  return src.replace(/^#\s.+\n+/, "");
}

export function Section({
  id,
  number,
  title,
  file,
}: {
  id: string;
  number?: number | null;
  title: string;
  file: string;
}) {
  const raw = stripH1(readMdx(file));
  return (
    <section className="mb-20 scroll-mt-24" aria-labelledby={id}>
      <SectionAnchor id={id} number={number} title={title} />
      <div className="prose-brief max-w-reading">
        <MDXRemote source={raw} components={mdxComponents} />
      </div>
    </section>
  );
}
