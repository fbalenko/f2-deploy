import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TableOfContents } from "@/components/TableOfContents";
import { FoundersNote } from "@/components/FoundersNote";
import { Section } from "@/components/Section";
import { CoverLetterSection } from "@/components/CoverLetterSection";
import { SECTIONS } from "@/lib/site";

export default function Page() {
  const numbered = SECTIONS.filter(
    (s) => s.number !== null && s.id !== "section-6",
  );

  return (
    <>
      <SiteHeader />
      <main id="top" className="mx-auto w-full max-w-[1180px] px-5 pb-10 pt-12 md:px-8 md:pt-16">
        <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-[200px_minmax(0,1fr)]">
          <TableOfContents />

          <div>
            <FoundersNote />

            {numbered.map((s) => (
              <Section
                key={s.id}
                id={s.id}
                number={s.number}
                title={s.title}
                file={s.file}
              />
            ))}

            <CoverLetterSection />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
