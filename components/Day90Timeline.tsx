"use client";

const POINTS = [
  { day: "Day 1", label: "Kickoff", anchor: "days-114" },
  { day: "Day 14", label: "Foundation set", anchor: "day-14-milestone" },
  { day: "Day 30", label: "Tier 1 live", anchor: "day-30-milestone" },
  { day: "Day 45", label: "First IC memo", anchor: "days-3160" },
  { day: "Day 60", label: "Tier 2 live", anchor: "day-60-milestone" },
  { day: "Day 90", label: "QBR", anchor: "day-90-milestone" },
];

export function Day90Timeline() {
  return (
    <div className="not-prose my-8 max-w-reading rounded border border-rule bg-paper px-5 py-6 md:px-7">
      <p className="mb-5 font-sans text-[10.5px] uppercase tracking-[0.12em] text-muted">
        Milestones
      </p>

      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[10px] h-px bg-rule" />
          <ol className="relative grid grid-cols-6 gap-2">
            {POINTS.map((p) => (
              <li key={p.day} className="flex flex-col items-center text-center">
                <span className="z-10 mb-3 h-[10px] w-[10px] rounded-full border border-accent bg-paper" />
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
                  {p.day}
                </span>
                <span className="mt-1 max-w-[10ch] font-serif text-[13px] leading-snug text-ink">
                  {p.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile: vertical */}
      <ol className="space-y-3 md:hidden">
        {POINTS.map((p) => (
          <li key={p.day} className="flex items-baseline gap-3">
            <span className="w-16 shrink-0 font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
              {p.day}
            </span>
            <span className="font-serif text-[14.5px] text-ink">{p.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
