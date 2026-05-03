import { Link as LinkIcon } from "lucide-react";

export function SectionAnchor({
  id,
  number,
  title,
  className = "",
}: {
  id: string;
  number?: number | null;
  title: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={
        "section-anchor-heading group mb-5 flex flex-wrap items-baseline gap-3 " +
        className
      }
    >
      {number != null && (
        <span className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-accent">
          §{number}
        </span>
      )}
      <span className="font-serif text-[1.7rem] font-semibold leading-tight tracking-tight text-ink md:text-[1.85rem]">
        {title}
      </span>
      <a
        href={`#${id}`}
        aria-label={`Anchor link to ${title}`}
        className="section-anchor-link ml-1 self-center text-muted hover:!opacity-80"
      >
        <LinkIcon size={14} />
      </a>
    </h2>
  );
}
