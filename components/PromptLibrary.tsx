import { prompts } from "@/lib/content";
import { PromptCard } from "./PromptCard";

const TIERS: { tier: 1 | 2 | 3; label: string; intro: string }[] = [
  {
    tier: 1,
    label: "Tier 1 — Day 1 launch prompts",
    intro:
      "These four prompts ship in the first two weeks. They are partner-non-facing, Associate-validated, and structured around F2's strongest capabilities (Excel Intelligence and Auto-calc). The deployment lives or dies on whether these four work cleanly for two live diligences inside the first 30 days.",
  },
  {
    tier: 2,
    label: "Tier 2 — Days 31–60 prompts",
    intro:
      "These four prompts ship after Tier 1 has validated F2's quantitative reliability. They are partner-facing or partner-adjacent and require trust earned in the first 30 days. The first F2-assisted IC memo at Meridian credit committee is the day-45 milestone.",
  },
  {
    tier: 3,
    label: "Tier 3 — Days 61–90+ prompts",
    intro:
      "These two prompts ship after the deployment is established. Both are timing-dependent — portfolio monitoring depends on quarterly cadence, LP DDQ depends on incoming questionnaire flow.",
  },
];

export function PromptLibrary() {
  return (
    <div className="not-prose mt-8 space-y-12">
      {TIERS.map((tier) => {
        const items = prompts.filter((p) => p.tier === tier.tier);
        return (
          <section key={tier.tier}>
            <h3 className="mb-2 font-serif text-[1.2rem] font-semibold text-ink">
              {tier.label}
            </h3>
            <p className="mb-5 max-w-reading font-serif text-[15.5px] leading-relaxed text-ink/85">
              {tier.intro}
            </p>
            <div className="space-y-4">
              {items.map((p) => (
                <PromptCard key={p.n} prompt={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
