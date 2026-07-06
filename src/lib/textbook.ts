import type { SubjectId, TextbookSection, TextbookSource } from "../types";

const headingPattern = /^(#{1,4})\s+(.+)$/;

function normalizeHeading(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function makeId(subjectId: SubjectId, index: number, title: string) {
  const ascii = title
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${subjectId}-${String(index + 1).padStart(3, "0")}-${ascii.slice(0, 48) || "section"}`;
}

export function parseTextbook(source: TextbookSource): TextbookSection[] {
  const lines = source.raw.split(/\r?\n/);
  const sections: TextbookSection[] = [];
  let currentTitle = source.title;
  let currentLevel = 1;
  let currentChapter = source.title;
  let currentBody: string[] = [];
  let sectionIndex = 0;

  const flush = () => {
    const body = currentBody.join("\n").trim();
    if (!body && currentTitle === source.title) return;
    sections.push({
      id: makeId(source.id, sectionIndex, currentTitle),
      subjectId: source.id,
      title: currentTitle,
      chapterTitle: currentChapter,
      level: currentLevel,
      body,
      searchableText: `${currentChapter} ${currentTitle} ${body}`.toLowerCase(),
    });
    sectionIndex += 1;
  };

  for (const line of lines) {
    const match = line.match(headingPattern);
    if (match) {
      flush();
      currentLevel = match[1].length;
      currentTitle = normalizeHeading(match[2]);
      const isChapter =
        (source.id === "member" && currentLevel === 1) ||
        (source.id === "roumu" && currentLevel === 2) ||
        (source.id === "keisu" && currentLevel <= 2);
      if (isChapter) {
        currentChapter = currentTitle;
      }
      currentBody = [];
      continue;
    }
    currentBody.push(line);
  }
  flush();

  return sections.filter((section) => section.title !== source.title || section.body);
}

export function resolveSourceSection(
  sections: TextbookSection[],
  subjectId: SubjectId,
  heading: string,
) {
  const normalized = normalizeHeading(heading);
  return (
    sections.find(
      (section) => section.subjectId === subjectId && section.title === normalized,
    ) ??
    sections.find(
      (section) =>
        section.subjectId === subjectId &&
        (section.title.includes(normalized) || normalized.includes(section.title)),
    ) ??
    sections.find((section) => section.subjectId === subjectId)
  );
}

export function markdownToBlocks(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function uniqueChapters(sections: TextbookSection[]) {
  return Array.from(new Set(sections.map((section) => section.chapterTitle)));
}
