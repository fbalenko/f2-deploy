import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import promptsData from "@/content/prompts.json";
import catchesData from "@/content/catches.json";

export type Prompt = {
  n: number;
  title: string;
  tier: 1 | 2 | 3;
  tierLabel: string;
  useCase: string | null;
  whyMatters: string | null;
  promptBody: string | null;
  expectedOutput: string | null;
  edgeCases: string | null;
  auditChecklist: string | null;
};

export type Catch = {
  n: number;
  axis: number;
  axisName: string;
  whatCatches: string | null;
  whyMatters: string | null;
  promptFix: string | null;
  ticket: string | null;
};

export const prompts = promptsData as Prompt[];
export const catches = catchesData as Catch[];

export function readMdx(file: string): string {
  const path = resolve(process.cwd(), "content", `${file}.mdx`);
  return readFileSync(path, "utf8");
}
