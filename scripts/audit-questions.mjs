import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionFile = path.join(root, "src/data/questions.ts");
const sources = {
  member: path.join(root, "source-review/cleaned/member_shido_reviewed.md"),
  roumu: path.join(root, "source-review/cleaned/roumu_kanri_reviewed.md"),
  keisu: path.join(root, "source-review/cleaned/keisu_nyumon_reviewed.md"),
};

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

const sourceText = Object.fromEntries(
  Object.entries(sources).map(([subjectId, file]) => [
    subjectId,
    fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "",
  ]),
);
const ts = fs.readFileSync(questionFile, "utf8");
const idMatches = [...ts.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
const duplicates = idMatches.filter((id, index) => idMatches.indexOf(id) !== index);

if (duplicates.length) {
  fail(`duplicate question ids: ${Array.from(new Set(duplicates)).join(", ")}`);
}

const questionBlocks = ts
  .split(/\n\s*{\n\s*id:\s*"/)
  .slice(1)
  .map((block) => `{\n  id: "${block}`);

const counts = { member: 0, roumu: 0, keisu: 0 };
const missingRefs = [];
const missingExplanations = [];

for (const block of questionBlocks) {
  const id = block.match(/\bid:\s*"([^"]+)"/)?.[1] ?? "(unknown)";
  const subjectId = block.match(/\bsubjectId:\s*"(member|roumu|keisu)"/)?.[1];
  const explanation = block.match(/\bexplanation:\s*"([\s\S]*?)",\n\s*sourceRef:/)?.[1] ?? "";
  const sourceRef = block.match(/sourceRef:\s*{([\s\S]*?)}/)?.[1] ?? "";
  const sourceSubjectId = sourceRef.match(/\bsubjectId:\s*"(member|roumu|keisu)"/)?.[1];
  const heading = normalize(sourceRef.match(/\bheading:\s*"([^"]+)"/)?.[1] ?? "");

  if (subjectId && counts[subjectId] !== undefined) counts[subjectId] += 1;
  if (!explanation || explanation.length < 20) missingExplanations.push(id);

  const subjectForRef = sourceSubjectId ?? subjectId;
  if (!subjectForRef || !heading || !sourceText[subjectForRef]?.includes(heading)) {
    missingRefs.push(`${id} -> ${subjectForRef ?? "unknown"} / ${heading || "heading missing"}`);
  }
}

if (missingExplanations.length) {
  fail(`questions with missing or too-short explanations: ${missingExplanations.join(", ")}`);
}

if (missingRefs.length) {
  fail(`source headings not found in cleaned markdown:\n${missingRefs.join("\n")}`);
}

const total = questionBlocks.length;
console.log(`questions: ${total}`);
console.log(`member: ${counts.member}`);
console.log(`roumu: ${counts.roumu}`);
console.log(`keisu: ${counts.keisu}`);

if (!process.exitCode) {
  console.log("question audit: ok");
}
