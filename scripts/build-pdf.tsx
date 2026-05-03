import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const SITE = {
  title: "A Mid-Market Private Credit Fund's First 90 Days on F2",
  subtitle: "Field Brief by Filip Balenko",
  buildDate: "May 2026",
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 64,
    paddingHorizontal: 64,
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    color: "#0F0F0F",
    backgroundColor: "#FFFFFF",
  },
  titlePage: {
    paddingTop: 180,
    paddingHorizontal: 80,
    fontFamily: "Times-Roman",
    color: "#0F0F0F",
    backgroundColor: "#FFFFFF",
  },
  titleEyebrow: {
    fontFamily: "Helvetica",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#6B6B68",
    marginBottom: 24,
    textTransform: "uppercase",
  },
  titleH1: {
    fontFamily: "Times-Roman",
    fontSize: 28,
    lineHeight: 1.2,
    marginBottom: 32,
  },
  titleByline: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#6B6B68",
    marginBottom: 4,
  },
  header: {
    position: "absolute",
    top: 28,
    left: 64,
    right: 64,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: "#6B6B68",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  headerRule: {
    position: "absolute",
    top: 48,
    left: 64,
    right: 64,
    height: 0.5,
    backgroundColor: "#E5E5E2",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 64,
    right: 64,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: "#6B6B68",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  footerRule: {
    position: "absolute",
    bottom: 44,
    left: 64,
    right: 64,
    height: 0.5,
    backgroundColor: "#E5E5E2",
  },
  h1: {
    fontFamily: "Times-Bold",
    fontSize: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  sectionLabel: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#2D4A6B",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 8,
  },
  h2: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    marginTop: 14,
    marginBottom: 6,
  },
  h3: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    marginTop: 10,
    marginBottom: 4,
  },
  p: {
    marginBottom: 7,
    lineHeight: 1.5,
  },
  li: {
    marginBottom: 3,
    paddingLeft: 12,
  },
  liBullet: {
    width: 12,
  },
  pre: {
    fontFamily: "Courier",
    fontSize: 8.5,
    lineHeight: 1.4,
    paddingLeft: 12,
    marginVertical: 6,
  },
  preLine: {
    fontFamily: "Courier",
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#222",
  },
  inlineCode: {
    fontFamily: "Courier",
    fontSize: 9.5,
    backgroundColor: "#F0F0EC",
  },
  hr: {
    height: 0.5,
    backgroundColor: "#E5E5E2",
    marginVertical: 10,
  },
});

// ---------- Markdown → PDF blocks ----------
type Block =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "pre"; text: string }
  | { kind: "hr" };

function parseMarkdown(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.trim() === "---") {
      blocks.push({ kind: "hr" });
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ kind: "pre", text: buf.join("\n") });
      continue;
    }

    if (line.startsWith("#### ")) {
      blocks.push({ kind: "h4", text: line.slice(5).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ kind: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ kind: "h1", text: line.slice(2).trim() });
      i++;
      continue;
    }

    if (/^\s*[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        let item = lines[i].replace(/^\s*[-*]\s/, "");
        i++;
        // join continuation lines (indented or non-empty without bullet/number)
        while (
          i < lines.length &&
          lines[i].trim() !== "" &&
          !/^\s*[-*]\s/.test(lines[i]) &&
          !/^\s*\d+\.\s/.test(lines[i]) &&
          !/^#{1,6}\s/.test(lines[i]) &&
          !lines[i].startsWith("```")
        ) {
          item += " " + lines[i].trim();
          i++;
        }
        items.push(item);
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        let item = lines[i].replace(/^\s*\d+\.\s/, "");
        i++;
        while (
          i < lines.length &&
          lines[i].trim() !== "" &&
          !/^\s*\d+\.\s/.test(lines[i]) &&
          !/^\s*[-*]\s/.test(lines[i]) &&
          !/^#{1,6}\s/.test(lines[i]) &&
          !lines[i].startsWith("```")
        ) {
          item += " " + lines[i].trim();
          i++;
        }
        items.push(item);
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    // Paragraph: collect until blank line
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*[-*]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      lines[i].trim() !== "---"
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ kind: "p", text: buf.join(" ") });
  }
  return blocks;
}

// Inline tokens: **bold**, *italic*, `code`, [link](url)
function renderInline(text: string, baseStyle: any = {}): React.ReactNode {
  const out: React.ReactNode[] = [];
  let key = 0;
  // Strip raw markdown anchors that we don't want to render
  const clean = text.replace(/<\/?[A-Za-z][^>]*\/?>/g, "");
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean)) !== null) {
    if (m.index > last) {
      out.push(<Text key={key++}>{clean.slice(last, m.index)}</Text>);
    }
    if (m[2] !== undefined) {
      out.push(
        <Text key={key++} style={{ fontFamily: "Times-Bold" }}>
          {m[2]}
        </Text>,
      );
    } else if (m[3] !== undefined) {
      out.push(
        <Text key={key++} style={{ fontFamily: "Times-Italic" }}>
          {m[3]}
        </Text>,
      );
    } else if (m[4] !== undefined) {
      out.push(
        <Text key={key++} style={styles.inlineCode}>
          {m[4]}
        </Text>,
      );
    } else if (m[5] !== undefined) {
      out.push(<Text key={key++}>{m[5]}</Text>);
    }
    last = m.index + m[0].length;
  }
  if (last < clean.length) {
    out.push(<Text key={key++}>{clean.slice(last)}</Text>);
  }
  return out;
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "h1":
      return <Text style={styles.h1}>{block.text}</Text>;
    case "h2":
      return <Text style={styles.h2}>{renderInline(block.text)}</Text>;
    case "h3":
      return <Text style={styles.h3}>{renderInline(block.text)}</Text>;
    case "h4":
      return <Text style={styles.h3}>{renderInline(block.text)}</Text>;
    case "p":
      return <Text style={styles.p}>{renderInline(block.text)}</Text>;
    case "hr":
      return <View style={styles.hr} />;
    case "pre":
      return (
        <View style={styles.pre} wrap>
          {block.text.split("\n").map((line, idx) => (
            <Text key={idx} style={styles.preLine}>{line || " "}</Text>
          ))}
        </View>
      );
    case "ul":
      return (
        <View style={{ marginVertical: 4 }}>
          {block.items.map((it, idx) => (
            <Text key={idx} style={{ marginBottom: 3, paddingLeft: 12, textIndent: -12 }}>
              <Text>•  </Text>
              {renderInline(it)}
            </Text>
          ))}
        </View>
      );
    case "ol":
      return (
        <View style={{ marginVertical: 4 }}>
          {block.items.map((it, idx) => (
            <Text key={idx} style={{ marginBottom: 3, paddingLeft: 16, textIndent: -16 }}>
              <Text>{idx + 1}.  </Text>
              {renderInline(it)}
            </Text>
          ))}
        </View>
      );
  }
}

// ---------- Compose document ----------
function readContent(file: string) {
  return readFileSync(resolve(process.cwd(), "content", `${file}.mdx`), "utf8");
}

function stripMdxComponents(s: string) {
  return s.replace(/<[A-Z][A-Za-z0-9]*\s*\/?>/g, "");
}

const SECTION_FILES: { number: number | null; title: string; file: string }[] = [
  { number: null, title: "Founder's Note", file: "founders-note" },
  { number: 1, title: "Customer Persona — Meridian Credit Partners", file: "01-persona" },
  { number: 2, title: "Workflow Decomposition", file: "02-workflow" },
  { number: 3, title: "Prompt Library", file: "03-prompts" },
  { number: 4, title: "Output Audit Rubric", file: "04-rubric" },
  { number: 5, title: "30/60/90 Deployment Plan for Meridian", file: "05-deployment-plan" },
];

function PageHeader() {
  return (
    <>
      <View style={styles.header} fixed>
        <Text>Field Brief — Filip Balenko — {SITE.buildDate}</Text>
        <Text>{SITE.title}</Text>
      </View>
      <View style={styles.headerRule} fixed />
    </>
  );
}

function PageFooter() {
  return (
    <>
      <View style={styles.footerRule} fixed />
      <View style={styles.footer} fixed>
        <Text>F2 AI Deployment Strategist · Application Materials</Text>
        <Text
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </>
  );
}

function SectionPages({
  number,
  title,
  blocks,
  extra,
}: {
  number: number | null;
  title: string;
  blocks: Block[];
  extra?: React.ReactNode;
}) {
  return (
    <Page size="LETTER" style={styles.page} wrap>
      <PageHeader />
      <View>
        {number !== null && (
          <Text style={styles.sectionLabel}>§{number}</Text>
        )}
        <Text style={styles.h1}>{title}</Text>
      </View>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
      {extra}
      <PageFooter />
    </Page>
  );
}

function PromptsBody() {
  const promptsJson = JSON.parse(
    readFileSync(resolve(process.cwd(), "content/prompts.json"), "utf8"),
  );
  const tierLabels: Record<number, string> = {
    1: "Tier 1 — Day 1 launch prompts",
    2: "Tier 2 — Days 31–60 prompts",
    3: "Tier 3 — Days 61–90+ prompts",
  };

  return (
    <>
      {[1, 2, 3].map((tier) => (
        <View key={tier}>
          <Text style={styles.h2}>{tierLabels[tier]}</Text>
          {promptsJson
            .filter((p: any) => p.tier === tier)
            .map((p: any) => (
              <View key={p.n} wrap style={{ marginBottom: 14 }}>
                <Text style={styles.h3}>{p.title}</Text>
                {p.useCase && (
                  <Text style={styles.p}>
                    {renderInline(`**Use case.** ${p.useCase}`)}
                  </Text>
                )}
                {p.whyMatters && (
                  <Text style={styles.p}>
                    {renderInline(
                      `**Why this prompt matters at deployment.** ${p.whyMatters}`,
                    )}
                  </Text>
                )}
                {p.promptBody && (
                  <View style={styles.pre} wrap>
                    {String(p.promptBody)
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <Text key={idx} style={styles.preLine}>
                          {line || " "}
                        </Text>
                      ))}
                  </View>
                )}
                {p.expectedOutput && (
                  <Text style={styles.p}>
                    {renderInline(
                      `**Expected output shape.** ${p.expectedOutput}`,
                    )}
                  </Text>
                )}
                {p.edgeCases && (
                  <>
                    <Text style={styles.h3}>Edge cases</Text>
                    {parseMarkdown(p.edgeCases).map((b, idx) => (
                      <BlockView key={idx} block={b} />
                    ))}
                  </>
                )}
                {p.auditChecklist && (
                  <>
                    <Text style={styles.h3}>Audit checklist</Text>
                    {parseMarkdown(p.auditChecklist).map((b, idx) => (
                      <BlockView key={idx} block={b} />
                    ))}
                  </>
                )}
              </View>
            ))}
        </View>
      ))}
    </>
  );
}

function FieldBriefDoc() {
  const sections = SECTION_FILES.map((s) => {
    const raw = stripMdxComponents(readContent(s.file)).replace(/^#\s.+\n+/, "");
    const blocks = parseMarkdown(raw);
    return { ...s, blocks };
  });

  return (
    <Document title="Field Brief — Filip Balenko" author="Filip Balenko">
      {/* Title page */}
      <Page size="LETTER" style={styles.titlePage}>
        <Text style={styles.titleEyebrow}>Field Brief · v1.0 · {SITE.buildDate}</Text>
        <Text style={styles.titleH1}>{SITE.title}</Text>
        <Text style={styles.titleByline}>{SITE.subtitle}</Text>
        <Text style={[styles.titleByline, { marginTop: 80 }]}>
          Application — F2 AI Deployment Strategist
        </Text>
      </Page>

      {sections.map((s) => (
        <SectionPages
          key={s.file}
          number={s.number}
          title={s.title}
          blocks={s.blocks}
          extra={s.file === "03-prompts" ? <PromptsBody /> : undefined}
        />
      ))}
    </Document>
  );
}

async function main() {
  const outDir = resolve(process.cwd(), "public");
  mkdirSync(outDir, { recursive: true });
  const stream = await pdf(<FieldBriefDoc />).toBuffer();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  const buf = Buffer.concat(chunks);
  const outPath = resolve(outDir, "field-brief.pdf");
  writeFileSync(outPath, buf);
  console.log(`Wrote ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
