import { PromptLibrary } from "./PromptLibrary";
import { AuditCatches } from "./AuditCatchBlock";
import { Day90Timeline } from "./Day90Timeline";

// Slug helper for ids on H3 headings
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const mdxComponents = {
  PromptLibrary,
  AuditCatches,
  Day90Timeline,
  // Section MDX files render their own H1 — but pages override H1 via the SectionAnchor component
  // and pass the MDX content with the H1 line stripped. Only H3+ get rendered from inside MDX.
  h1: () => null,
  h3: (props: any) => (
    <h3 id={slug(String(props.children ?? ""))} {...props} />
  ),
  h4: (props: any) => (
    <h4 id={slug(String(props.children ?? ""))} {...props} />
  ),
};
