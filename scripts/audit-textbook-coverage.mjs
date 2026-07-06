import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const files = [
  "source-review/cleaned/member_shido_reviewed.md",
  "source-review/cleaned/roumu_kanri_reviewed.md",
];

const stripSpaces = (value) => value.replace(/\s+/g, "");
const isListLine = (line) => /^(\d+\.|[-*]|[・●])\s*/.test(line.trim());
const isTableLine = (line) => /^\|/.test(line.trim());

function sectionsFor(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const sections = [];
  let current = null;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line.startsWith("### ")) {
      if (current) {
        current.end = lineNumber - 1;
        sections.push(current);
      }
      current = {
        title: line.slice(4).trim(),
        start: lineNumber,
        end: lineNumber,
        body: [],
      };
      return;
    }
    if (current) current.body.push(line);
  });

  if (current) {
    current.end = lines.length;
    sections.push(current);
  }

  return sections;
}

function classify(section) {
  const nonEmpty = section.body.map((line) => line.trim()).filter(Boolean);
  const text = stripSpaces(nonEmpty.join("\n"));
  const bullets = nonEmpty.filter(isListLine).length;
  const tables = nonEmpty.filter(isTableLine).length;
  const prose = nonEmpty.filter((line) => !isListLine(line) && !isTableLine(line)).length;

  const reasons = [];
  if (text.length < 120) reasons.push("本文量が極端に少ない");
  if (nonEmpty.length <= 3) reasons.push("実質行数が少ない");
  if (bullets >= 2 && prose === 0) reasons.push("箇条書きのみで説明文なし");
  if (tables > 0 && text.length < 220) reasons.push("表だけ/表周辺説明が薄い");

  let priority = "low";
  if (reasons.length >= 2 || text.length < 80) priority = "high";
  else if (reasons.length === 1) priority = "medium";

  return {
    ...section,
    chars: text.length,
    lines: nonEmpty.length,
    bullets,
    tables,
    prose,
    reasons,
    priority,
  };
}

for (const file of files) {
  const path = resolve(file);
  const risky = sectionsFor(path)
    .map(classify)
    .filter((section) => section.reasons.length > 0);

  console.log(`\n## ${file}`);
  console.log(`suspect sections: ${risky.length}`);
  for (const section of risky) {
    console.log(
      [
        section.priority.padEnd(6),
        `${section.start}-${section.end}`.padEnd(11),
        `chars=${String(section.chars).padStart(4)}`,
        `lines=${String(section.lines).padStart(2)}`,
        `bullets=${String(section.bullets).padStart(2)}`,
        section.title,
        `(${section.reasons.join(" / ")})`,
      ].join(" | "),
    );
  }
}
