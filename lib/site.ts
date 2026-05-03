export const SITE = {
  title: "Field Brief — Filip Balenko — F2 AI Deployment Strategist",
  subtitle: "A Mid-Market Private Credit Fund's First 90 Days on F2",
  author: "Filip Balenko",
  email: "filippbalenko@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/filipbalenko/",
    github: "https://github.com/fbalenko/f2-deploy",
    sfvic: "https://sfv-ic.com",
  },
  version: "v1.0",
  buildDate: "2026-05-03",
};

export const SECTIONS = [
  { id: "founders-note", number: null, title: "Founder's Note", file: "founders-note" },
  { id: "section-1", number: 1, title: "Customer Persona", file: "01-persona" },
  { id: "section-2", number: 2, title: "Workflow Decomposition", file: "02-workflow" },
  { id: "section-3", number: 3, title: "Prompt Library", file: "03-prompts" },
  { id: "section-4", number: 4, title: "Output Audit Rubric", file: "04-rubric" },
  { id: "section-5", number: 5, title: "30/60/90 Deployment Plan", file: "05-deployment-plan" },
  { id: "section-6", number: 6, title: "Cover Letter", file: "06-cover-letter" },
] as const;

export type SectionMeta = typeof SECTIONS[number];
