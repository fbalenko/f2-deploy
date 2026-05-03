import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = readFileSync(resolve(root, 'CONTENT.md'), 'utf8');
const lines = src.split('\n');

// ---------- Locate ## section boundaries ----------
const h2 = [];
lines.forEach((line, i) => {
  if (/^## (?!#)/.test(line)) h2.push({ idx: i, title: line.slice(3).trim() });
});

function sliceBetween(startIdx, endIdx) {
  return lines.slice(startIdx, endIdx).join('\n').trim() + '\n';
}

const sections = {};
for (let i = 0; i < h2.length; i++) {
  const start = h2[i].idx + 1; // skip the H2 itself; we'll add titles in MDX
  const end = i + 1 < h2.length ? h2[i + 1].idx : lines.length;
  // Strip trailing horizontal rule "---" if present
  let body = sliceBetween(start, end);
  body = body.replace(/\n---\s*\n*$/, '\n');
  sections[h2[i].title] = body.trim();
}

// ---------- Write MDX files for the simpler sections ----------
// MDX treats `{` and `}` as JS expression delimiters. Escape every brace in the
// markdown body, then re-allow our injected component tags (which use < >, not braces).
function escapeBraces(s) {
  return s.replace(/\{/g, "\\{").replace(/\}/g, "\\}");
}
const writeMdx = (filename, title, body) => {
  const escaped = escapeBraces(body);
  const out = `# ${title}\n\n${escaped}\n`;
  writeFileSync(resolve(root, 'content', filename), out, 'utf8');
};

writeMdx("founders-note.mdx", "Founder's Note", sections["Founder's Note"]);
writeMdx("01-persona.mdx", "Customer Persona — Meridian Credit Partners", sections["1. Customer Persona — Meridian Credit Partners"]);
writeMdx("02-workflow.mdx", "Workflow Decomposition", sections["2. Workflow Decomposition"]);

// Rubric: inject <AuditCatches /> in place of the three Catch blocks
{
  const rubric = sections["4. Output Audit Rubric"];
  const beforeApplied = rubric.indexOf("### The audit, applied");
  const dontCatchIdx = rubric.indexOf("### What the audit doesn't catch");
  const before = rubric.slice(0, beforeApplied).trim();
  const after = rubric.slice(dontCatchIdx).trim();
  const auditAppliedIntro = rubric.slice(beforeApplied, rubric.indexOf("#### Catch")).trim();
  const merged = `${before}\n\n${auditAppliedIntro}\n\n<AuditCatches />\n\n${after}`;
  writeMdx("04-rubric.mdx", "Output Audit Rubric", merged);
}

writeMdx("05-deployment-plan.mdx", "The 30/60/90 Deployment Plan for Meridian", sections["5. The 30/60/90 Deployment Plan for Meridian"]);

// Deployment plan: inject <Day90Timeline /> right after the introductory paragraphs
{
  const plan = sections["5. The 30/60/90 Deployment Plan for Meridian"];
  // Insert the timeline right after "### How to read this section" block, just before "### Pre-deployment week"
  const insertBefore = "### Pre-deployment week";
  const at = plan.indexOf(insertBefore);
  if (at > -1) {
    const merged = plan.slice(0, at) + "<Day90Timeline />\n\n" + plan.slice(at);
    writeMdx("05-deployment-plan.mdx", "The 30/60/90 Deployment Plan for Meridian", merged);
  }
}

writeMdx("06-cover-letter.mdx", "Cover Letter", sections["6. Cover Letter"]);
writeMdx("author-bio.mdx", "Author Bio", sections["Author Bio"]);

// ---------- Section 3 — Prompts: parse into prompts.json + a wrapper MDX ----------
const promptsRaw = sections["3. Prompt Library"];

// Collect tier blocks. The tier headers are "### Tier N — ..." inside section 3.
const promptsText = promptsRaw;
const tierHeaderRe = /^### Tier (\d) — .*$/gm;
const tierBlocks = [];
let m;
const tierMatches = [];
while ((m = tierHeaderRe.exec(promptsText)) !== null) {
  tierMatches.push({ tier: Number(m[1]), idx: m.index, header: m[0] });
}
for (let i = 0; i < tierMatches.length; i++) {
  const start = tierMatches[i].idx;
  const end = i + 1 < tierMatches.length ? tierMatches[i + 1].idx : promptsText.length;
  tierBlocks.push({
    tier: tierMatches[i].tier,
    body: promptsText.slice(start, end),
  });
}

const TIER_LABELS = {
  1: "Tier 1 — Day 1 Launch",
  2: "Tier 2 — Days 31–60",
  3: "Tier 3 — Days 61–90+",
};

const prompts = [];
for (const block of tierBlocks) {
  // Each prompt header is "#### Prompt N — Title"
  const promptRe = /^#### Prompt (\d+) — (.+)$/gm;
  const matches = [];
  let pm;
  while ((pm = promptRe.exec(block.body)) !== null) {
    matches.push({ n: Number(pm[1]), title: pm[2].trim(), idx: pm.index });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].idx;
    const end = i + 1 < matches.length ? matches[i + 1].idx : block.body.length;
    const body = block.body.slice(start, end);
    prompts.push(parsePrompt(body, matches[i].n, matches[i].title, block.tier));
  }
}

function extractAfter(body, label) {
  // Capture paragraph(s) following "**Label.**" until the next blank-line+** or "```" or "####"
  const re = new RegExp(`\\*\\*${label}\\*\\*([\\s\\S]*?)(?=\\n\\*\\*|\\n#### |\\n### |$)`);
  const match = body.match(re);
  if (!match) return null;
  return match[1].trim();
}

function extractCodeBlock(body) {
  const re = /```([\s\S]*?)```/;
  const match = body.match(re);
  return match ? match[1].trim().replace(/^\n+/, '') : null;
}

function extractBulletedList(body, label) {
  // Bulleted list following **Label.** up to the next ** heading or section
  const re = new RegExp(`\\*\\*${label}\\*\\*\\s*\\n+([\\s\\S]*?)(?=\\n\\*\\*|\\n#### |\\n### |$)`);
  const match = body.match(re);
  if (!match) return null;
  const block = match[1].trim();
  return block;
}

function parsePrompt(body, n, title, tier) {
  return {
    n,
    title: `Prompt ${n} — ${title}`,
    tier,
    tierLabel: TIER_LABELS[tier],
    useCase: extractAfter(body, "Use case\\."),
    whyMatters: extractAfter(body, "Why this prompt matters at deployment\\."),
    promptBody: extractCodeBlock(body),
    expectedOutput: extractAfter(body, "Expected output shape\\."),
    edgeCases: extractBulletedList(body, "Edge cases\\."),
    auditChecklist: extractBulletedList(body, "Audit checklist\\."),
  };
}

writeFileSync(resolve(root, 'content/prompts.json'), JSON.stringify(prompts, null, 2));

// Write a small MDX wrapper for section 3 — intro + design principles only.
const promptsIntroEnd = promptsText.search(/\n### Tier 1 /);
const promptsIntro = promptsText.slice(0, promptsIntroEnd).trim();
writeMdx("03-prompts.mdx", "Prompt Library", promptsIntro + "\n\n<PromptLibrary />");

// ---------- Section 4 — Catches: parse into catches.json ----------
const rubricRaw = sections["4. Output Audit Rubric"];
const catchRe = /^#### Catch #(\d+) — Axis (\d+) \(([^)]+)\) FAILURE/gm;
const catchHeaders = [];
let cm;
while ((cm = catchRe.exec(rubricRaw)) !== null) {
  catchHeaders.push({ n: Number(cm[1]), axis: Number(cm[2]), name: cm[3].trim(), idx: cm.index });
}
const catches = [];
for (let i = 0; i < catchHeaders.length; i++) {
  const start = catchHeaders[i].idx;
  const end = i + 1 < catchHeaders.length ? catchHeaders[i + 1].idx : rubricRaw.length;
  // End at next ### heading actually
  const restAfter = rubricRaw.slice(start, end);
  const nextSection = restAfter.search(/\n### /);
  const body = nextSection > -1 ? restAfter.slice(0, nextSection) : restAfter;

  const ch = catchHeaders[i];

  // Extract three sub-blocks: "What the rubric catches", "Prompt-side fix", "Engineering ticket"
  const whatCatches = extractAfter(body, "What the rubric catches\\.");
  const whyMatters = extractAfter(body, "Why this matters\\.");
  const promptFix = extractAfter(body, "Prompt-side fix\\.");
  const ticketMatch = body.match(/\*\*Engineering ticket — F2 platform\.\*\*\s*\n+```([\s\S]*?)```/);
  const ticket = ticketMatch ? ticketMatch[1].trim() : null;

  catches.push({
    n: ch.n,
    axis: ch.axis,
    axisName: ch.name,
    whatCatches,
    whyMatters,
    promptFix,
    ticket,
  });
}
writeFileSync(resolve(root, 'content/catches.json'), JSON.stringify(catches, null, 2));

console.log(`Wrote ${prompts.length} prompts and ${catches.length} catches.`);
console.log(`Sections produced: ${Object.keys(sections).join(", ")}`);
