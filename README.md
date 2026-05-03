# Field Brief — F2 AI Deployment Strategist

A deployment playbook for F2 (f2.ai), built as a job application artifact for the AI Deployment Strategist role.

**Live site:** https://f2-deploy.com

## What this is

A Field Brief showing how an AI Deployment Strategist would approach landing a real F2 customer in the first 90 days. The customer is fictional — Meridian Credit Partners, a composite modeled on publicly disclosed mid-market direct lenders in the $1–2B AUM band.

The brief covers six sections:

1. **Customer persona** — Meridian Credit Partners profile, workflow map, and F2 plug-in points
2. **Workflow decomposition** — F2 capability to customer task mapping with conservative time-savings estimates
3. **Prompt library** — 10 production-grade prompts across three deployment tiers (days 1–14, 31–60, 61–90+)
4. **Output audit rubric** — 5-axis QA framework applied to a deliberately flawed sample memo, with fixes ticketed to engineering
5. **30/60/90 deployment plan** — day-by-day plan with milestones, metrics, and named risks
6. **Cover letter and author bio**

## Why this exists

F2's AI Deployment Strategist role asks for someone who can speak underwriter and engineer in the same meeting. I built this Field Brief instead of a standard cover letter to demonstrate the methodology rather than describe it.

## About the author

Filip Balenko is Co-Founder and Managing Director of Extra Business Funding, an alternative lending firm that has funded 35+ deals using proprietary AI-driven underwriting infrastructure. Previously Co-Founder/CFO at Devola Technologies, with private credit and trade finance internships at Scale Capital and Express Trade Capital. B.S. Business and Economics, Lehigh University, 2025.

LinkedIn: https://www.linkedin.com/in/filipbalenko/
Email: filippbalenko@gmail.com
Other agentic AI work: https://sfv-ic.com

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, MDX, react-pdf renderer. Deployed on Vercel.

## Local development

Run pnpm install, then pnpm dev for the dev server at localhost:3000, or pnpm build for a production build that also regenerates the PDF.

## License

This is a job application artifact. The content (Field Brief text) is copyright Filip Balenko 2026, all rights reserved. The site code is provided as a portfolio sample only.
