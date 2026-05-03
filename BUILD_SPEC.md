# F2 Deploy — Field Brief Site — Build Spec

## What you're building

A single-page, content-heavy marketing site that hosts a "Field Brief"
applying for the AI Deployment Strategist role at F2 (f2.ai). The
content already exists in CONTENT.md in the project root. Your job is
to build the site that wraps that content, deploy it, and produce a
PDF version.

The site is being built by Filip Balenko as a job application
artifact. It is methodology, not a product. There are no interactive
features, no chat interfaces, no dynamic data, no auth, no backend.
It is essentially a long-form technical document with navigation and
polish.

## Visual brief — read this carefully before writing any code

Restrained. IC-memo-adjacent. NOT a SaaS landing page. Reference points:
- Ramp blog (ramp.com/blog)
- Mercury blog (mercury.com/blog)
- Stripe Atlas guides (stripe.com/atlas/guides)
- Substack long-form essays

Anti-references (do NOT make it look like these):
- Modern SaaS landing pages with hero animations, gradient backgrounds,
  feature grids
- Dev tool documentation sites (Vercel, Next.js docs) — too utilitarian
- AI startup landing pages (Glean, Hebbia, Harvey) — too marketing

Specific aesthetic:
- Off-white background (#FAFAF7 or similar warm white, NOT pure white)
- Black or near-black body text (#0F0F0F)
- Single accent color: a muted institutional blue (#2D4A6B range) used
  sparingly for links and section markers only
- Serif typography for body (Iowan Old Style, Charter, or similar — use
  CSS font stack with system fallbacks; do NOT load Google Fonts for
  this)
- Monospace for code blocks (system mono stack)
- Sans-serif allowed for navigation and metadata only
- Generous line-height (1.6-1.8 on body)
- Wide margins on desktop (max-width ~720px for body text — this is
  reading-width, NOT app-width)
- NO drop shadows, NO gradients, NO animations beyond opacity/transform
  on hover, NO emoji, NO illustrations, NO stock photography

The site should feel like reading a long memorandum. If a reader on
day one mistakes it for a Substack post, that's a success signal.

## Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS (configured to support the visual brief above)
- MDX for content rendering (next-mdx-remote)
- Lucide React for the few icons needed
- Deploy target: Vercel

Use pnpm. Install all dependencies in one pass. Do NOT install:
- shadcn/ui (too generic-looking)
- Framer Motion (no animations needed)
- Any analytics package (Filip will add Plausible later if he wants)
- Any auth or database packages

## Site structure

Single page, anchor-linked sections. URL structure:
- / (the Field Brief itself)
- /pdf (downloadable PDF version — see PDF section below)

Sections in order, matching CONTENT.md:
1. Founder's note (top of page, before any heading)
2. Section 1 — Customer persona (Meridian Credit Partners)
3. Section 2 — Workflow decomposition
4. Section 3 — Prompt library
5. Section 4 — Output audit rubric
6. Section 5 — 30/60/90 deployment plan
7. Section 6 — Cover letter (collapsed by default; expandable)
8. Footer with author bio + links

## Required components

Build these as separate React components:

### 1. SiteHeader
Sticky top bar. Three elements:
- Left: "Field Brief" in serif, larger weight, with a subtle subtitle
  "A Mid-Market Private Credit Fund's First 90 Days on F2" in smaller
  sans-serif
- Center: nothing
- Right: link "Download PDF" → /pdf, link "Email Filip" → mailto link
  (use placeholder filip@example.com; Filip will replace)

Sticky behavior: stays at top on scroll, with a subtle bottom border
that becomes visible only after the user scrolls past the founder's
note.

### 2. TableOfContents (sidebar on desktop, collapsible drawer on mobile)
Auto-generated from H2 headings in the MDX content. Active section
highlights as user scrolls. Smooth-scrolls to section on click.
Desktop: fixed left sidebar, ~200px wide, scroll-independent.
Mobile: hidden by default; toggle button bottom-right opens a drawer.

### 3. SectionAnchor
Custom H2 component that renders with:
- A small section number ("§1", "§2") in the accent color, sans-serif,
  smaller font
- The section title in serif
- An invisible-until-hover anchor link icon to the right (Lucide Link)

### 4. PromptCard (used in Section 3 — Prompt Library)
Each of the 10 prompts in Section 3 should render as a card with:
- Tier label at top right ("Tier 1 — Day 1 Launch", etc.)
- Prompt title (H3, serif)
- "Use case" paragraph (always visible)
- Expandable details: the full prompt body (in monospace), expected
  output shape, edge cases, audit checklist
- Default state: collapsed (only title + use case visible)
- Click-to-expand with a smooth height transition (CSS only, no JS
  animation library)
- Visual treatment: thin border (#E5E5E2), subtle hover state, no
  shadow, no gradient

### 5. AuditCatchBlock (used in Section 4)
The three "Catch #N" blocks in Section 4 should render with a
distinctive visual treatment:
- Left border in the accent color, 3px wide
- Slightly indented from the body text
- Header "Catch #N — Axis N (Name) FAILURE" in bold serif
- Three sub-blocks: "What the rubric catches", "Prompt-side fix",
  "Engineering ticket" — the engineering ticket renders the code-block
  content in monospace, on a slightly darker background (#F0F0EC)

### 6. Day90Timeline (used in Section 5)
The day 1, 14, 30, 45, 60, 90 milestones from Section 5 should
render as a horizontal timeline on desktop (six points along a line),
with each point clickable to scroll to the corresponding day's
content. On mobile, this becomes a vertical stack.

### 7. CoverLetter (Section 6)
Renders the cover letter as a separate visual block, styled to look
like an actual business letter — letterhead-style header with Filip's
name, single-column layout, slightly narrower than the rest of the
content. Collapsed by default with a "Read the cover letter" toggle.

### 8. SiteFooter
Three-column on desktop, stacked on mobile:
- Left: author bio (~80 words)
- Center: links (LinkedIn, GitHub, sfv-ic.com, email)
- Right: "Field Brief v1.0 · Built [today's date] · Last updated [today]"

## MDX content handling

CONTENT.md needs to be split into individual section files for clean
rendering. Create:
- content/founders-note.mdx
- content/01-persona.mdx
- content/02-workflow.mdx
- content/03-prompts.mdx
- content/04-rubric.mdx
- content/05-deployment-plan.mdx
- content/06-cover-letter.mdx
- content/author-bio.mdx

Parse CONTENT.md to extract each section. The boundaries are the
"## 1.", "## 2.", etc. headings. The founder's note is the standalone
"## Founder's Note" section. The cover letter is "## 6. Cover Letter".
The author bio is "## Author Bio".

For the prompt library (Section 3), each of the 10 prompts must be
parsed into structured data so it can render as a PromptCard. Parse
each prompt block into:
- title (e.g., "Prompt 1 — Sponsor model intake and spread")
- tier (1, 2, or 3)
- useCase (the paragraph after "Use case.")
- whyMatters (the paragraph after "Why this prompt matters at deployment.")
- promptBody (the code block content)
- expectedOutput (the paragraph after "Expected output shape.")
- edgeCases (the bulleted list)
- auditChecklist (the numbered list under "Audit checklist")

Store this as content/prompts.json so the PromptCard component can
iterate over it.

For the audit rubric (Section 4), the three "Catch" blocks similarly
need to be parseable into structured data. Store as content/catches.json.

## PDF generation

Use Puppeteer or @react-pdf/renderer to generate a PDF from the site
content. The PDF should:
- Be a single document (~30-40 pages at standard letter size)
- Use the same typography as the site
- Include all six sections plus founder's note (NO cover letter — the
  cover letter goes to F2 separately as a Word/PDF attachment)
- Include page numbers in the footer
- Include "Field Brief — Filip Balenko — [date]" in the header
- Have a title page: "A Mid-Market Private Credit Fund's First 90 Days
  on F2 — Field Brief by Filip Balenko"

Generate the PDF at build time (not on each request). Store at
public/field-brief.pdf. The /pdf route should redirect to that file.

If Puppeteer adds significant complexity to deployment (it can on
Vercel), use @react-pdf/renderer instead — it's pure JS, no headless
browser. Make this judgment call based on what works cleanly.

## Responsive behavior

- Desktop (>1024px): left sidebar TOC visible, content max-width 720px,
  centered with sidebar offset
- Tablet (768-1024px): TOC collapses to top, content full-width with
  side margins
- Mobile (<768px): TOC becomes drawer accessed via floating button,
  content full-width, prompt cards stack vertically

## SEO and metadata

- <title>: "Field Brief — Filip Balenko — F2 AI Deployment Strategist"
- Meta description: First 150 characters of the founder's note
- Open Graph image: skip for v1, Filip will add later
- robots.txt: allow indexing
- No analytics, no tracking pixels

## Deployment

- Initialize git repo, first commit "Initial scaffold"
- Create vercel.json with appropriate build settings
- Do NOT actually deploy to Vercel — Filip will run `vercel deploy`
  himself. But do verify the build succeeds locally with `pnpm build`
  before declaring done.

## Quality bar

Before declaring the site complete, verify all of the following:

1. `pnpm dev` runs without errors
2. `pnpm build` runs without errors
3. All six sections render with correct typography
4. TOC auto-generates and active-section highlighting works on scroll
5. Prompt cards expand and collapse correctly on click
6. Cover letter toggles open/closed
7. Site renders correctly at desktop, tablet, and mobile widths
8. PDF generates successfully and includes all six sections
9. No console errors in the browser
10. No accessibility violations (run lighthouse or axe)

## Decisions you should make autonomously without asking

- Specific Tailwind config values (within the visual brief above)
- File and folder structure beyond what's specified
- Choice of Puppeteer vs @react-pdf/renderer for PDF
- Specific MDX parsing library (next-mdx-remote vs @next/mdx)
- Specific TOC implementation (custom hook vs library)
- Naming conventions for components and files
- Whether to use Server Components or Client Components for each piece
  (default to Server Components except where interactivity demands
  Client)
- Loading states, error boundaries, fallback content
- Specific spacing, padding, margin values within the visual brief

## Decisions where you should stop and ask Filip

- Anything that contradicts the visual brief above
- Anything that requires Filip's actual personal info (email, LinkedIn
  URL, GitHub URL — use placeholders for now)
- Anything that would change the content in CONTENT.md (do not edit
  the content; only structure how it renders)
- Anything that would require purchasing a service or domain

## Workflow

Work in this order:

1. Initialize the Next.js project with TypeScript and Tailwind
2. Configure Tailwind to support the visual brief (custom colors,
   font stacks, spacing)
3. Set up MDX rendering pipeline
4. Parse CONTENT.md into the eight content files + two JSON files
5. Build the layout shell (header, footer, TOC sidebar)
6. Build the section renderer with custom MDX components
7. Build the PromptCard, AuditCatchBlock, Day90Timeline, CoverLetter
   components
8. Wire up the TOC active-section highlighting
9. Implement responsive behavior
10. Generate the PDF
11. Run the quality-bar checklist
12. Commit final state to git

Commit incrementally — one logical unit per commit. Keep commits clean
and the messages descriptive.

## When you're done

Print a summary that includes:
- Final file tree (top three levels)
- Total LOC written
- Any decisions you made that you want Filip to verify
- The exact command Filip should run to start the dev server
- The exact command to deploy to Vercel
- Any known limitations or follow-up items

Then stop. Do not ask "should I do anything else" — Filip will review
and come back with feedback if needed.

## Begin
