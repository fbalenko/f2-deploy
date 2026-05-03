import { SITE } from "@/lib/site";
import { readMdx } from "@/lib/content";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";

export function SiteFooter() {
  const bio = readMdx("author-bio")
    .replace(/^# Author Bio\s*\n/, "")
    .trim();

  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="prose-brief font-serif text-[15px] leading-relaxed text-ink/90">
            <p className="mb-2 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
              Author
            </p>
            <MDXRemote source={bio} components={mdxComponents} />
          </div>

          <div>
            <p className="mb-2 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
              Links
            </p>
            <ul className="space-y-1.5 font-sans text-[13.5px]">
              <li>
                <a className="text-ink hover:text-accent" href={SITE.links.linkedin}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="text-ink hover:text-accent" href={SITE.links.github}>
                  GitHub
                </a>
              </li>
              <li>
                <a className="text-ink hover:text-accent" href={SITE.links.sfvic}>
                  sfv-ic.com
                </a>
              </li>
              <li>
                <a className="text-ink hover:text-accent" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
              Document
            </p>
            <p className="font-sans text-[13px] leading-relaxed text-muted">
              Field Brief {SITE.version}
              <br />
              Built {SITE.buildDate}
              <br />
              Last updated {SITE.buildDate}
            </p>
            <p className="mt-4 font-sans text-[13px]">
              <a className="text-ink hover:text-accent" href="/pdf">
                Download PDF →
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
