import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const progressPath = resolve(root, "source-review/proofreading-progress.json");
const lockPath = resolve(root, "source-review/proofreading-progress.lock");

const scans = [
  { id: "member-1", subject: "member", title: "メンバー指導①", pdf: "メンバー指導①.pdf", pages: 24 },
  { id: "member-2", subject: "member", title: "メンバー指導②", pdf: "メンバー指導②.pdf", pages: 14 },
  { id: "roumu-1", subject: "roumu", title: "労務管理①", pdf: "労務管理①.pdf", pages: 23 },
  { id: "roumu-2", subject: "roumu", title: "労務管理②", pdf: "労務管理②.pdf", pages: 23 },
  { id: "keisu-1", subject: "keisu", title: "計数①", pdf: "計数①.pdf", pages: 24 },
  { id: "keisu-2", subject: "keisu", title: "計数②", pdf: "計数②.pdf", pages: 24 },
  { id: "keisu-3", subject: "keisu", title: "計数③", pdf: "計数③.pdf", pages: 24 },
  { id: "keisu-4", subject: "keisu", title: "計数④", pdf: "計数④.pdf", pages: 9 },
];

function initialState() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    note: "PDFスキャンのページ単位進捗。done以外は未完了扱い。PDFは編集しない。",
    scans: scans.map((scan) => ({
      ...scan,
      pages: Array.from({ length: scan.pages }, (_, index) => ({
        page: index + 1,
        status: "pending",
        claimedAt: null,
        completedAt: null,
        summary: "",
      })),
    })),
  };
}

function load() {
  if (!existsSync(progressPath)) return initialState();
  const state = JSON.parse(readFileSync(progressPath, "utf8"));
  if (ensureScans(state)) save(state);
  return state;
}

function ensureScans(state) {
  let changed = false;
  for (const scan of scans) {
    if (state.scans.some((item) => item.id === scan.id)) continue;
    state.scans.push({
      ...scan,
      pages: Array.from({ length: scan.pages }, (_, index) => ({
        page: index + 1,
        status: "pending",
        claimedAt: null,
        completedAt: null,
        summary: "スキャン追加により台帳へ追加",
      })),
    });
    changed = true;
  }
  return changed;
}

function save(state) {
  state.updatedAt = new Date().toISOString();
  writeFileSync(progressPath, `${JSON.stringify(state, null, 2)}\n`);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function acquireLock() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30_000) {
    try {
      mkdirSync(lockPath);
      writeFileSync(
        resolve(lockPath, "owner.json"),
        `${JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() })}\n`,
      );
      return;
    } catch {
      if (existsSync(resolve(lockPath, "owner.json"))) {
        const statText = readFileSync(resolve(lockPath, "owner.json"), "utf8");
        const owner = JSON.parse(statText);
        if (Date.now() - new Date(owner.acquiredAt).getTime() > 30 * 60 * 1000) {
          rmSync(lockPath, { recursive: true, force: true });
          continue;
        }
      }
      sleep(500);
    }
  }
  throw new Error("Could not acquire proofreading progress lock within 30 seconds.");
}

function releaseLock() {
  rmSync(lockPath, { recursive: true, force: true });
}

function scanById(state, id) {
  const scan = state.scans.find((item) => item.id === id);
  if (!scan) throw new Error(`Unknown scan id: ${id}`);
  return scan;
}

function parsePages(value) {
  return value.split(",").flatMap((part) => {
    const range = part.split("-").map((item) => Number(item));
    if (range.length === 1) return range;
    const [start, end] = range;
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });
}

function staleInProgress(page) {
  if (page.status !== "in_progress" || !page.claimedAt) return false;
  const claimedAt = new Date(page.claimedAt).getTime();
  return Date.now() - claimedAt > 12 * 60 * 60 * 1000;
}

function selectable(page) {
  return page.status === "pending" || page.status === "needs_review" || staleInProgress(page);
}

function printStatus(state) {
  for (const scan of state.scans) {
    const counts = scan.pages.reduce(
      (acc, page) => {
        acc[page.status] = (acc[page.status] ?? 0) + 1;
        return acc;
      },
      {},
    );
    const done = counts.done ?? 0;
    const total = scan.pages.length;
    console.log(
      `${scan.id} ${scan.title}: ${done}/${total} done, pending=${counts.pending ?? 0}, in_progress=${counts.in_progress ?? 0}, needs_review=${counts.needs_review ?? 0}`,
    );
  }
}

function claim(state, limit) {
  const claimed = [];
  for (const scan of state.scans) {
    for (const page of scan.pages) {
      if (claimed.length >= limit) return claimed;
      if (!selectable(page)) continue;
      page.status = "in_progress";
      page.claimedAt = new Date().toISOString();
      page.summary = page.summary || "処理中";
      claimed.push({ scan, page });
    }
  }
  return claimed;
}

const [command = "status", ...args] = process.argv.slice(2);
const state = load();

if (command === "init") {
  if (existsSync(progressPath) && args[0] !== "--force") {
    throw new Error("Progress file already exists. Use --force to recreate.");
  }
  save(initialState());
  console.log(progressPath);
} else if (command === "status") {
  printStatus(state);
} else if (command === "claim") {
  const limit = Number(args[0] ?? 4);
  acquireLock();
  try {
    const lockedState = load();
    const claimed = claim(lockedState, limit);
    save(lockedState);
    for (const item of claimed) {
      console.log(`${item.scan.id} page ${item.page.page}: ${item.scan.title} / ${item.scan.pdf}`);
    }
    if (claimed.length === 0) console.log("No pending pages.");
  } finally {
    releaseLock();
  }
} else if (command === "done" || command === "needs-review" || command === "pending") {
  const [scanId, pagesValue, ...summaryParts] = args;
  if (!scanId || !pagesValue) {
    throw new Error(`Usage: ${command} <scan-id> <pages|range> [summary]`);
  }
  const status = command === "done" ? "done" : command === "needs-review" ? "needs_review" : "pending";
  acquireLock();
  try {
    const lockedState = load();
    const scan = scanById(lockedState, scanId);
    const pages = parsePages(pagesValue);
    for (const pageNumber of pages) {
      const page = scan.pages.find((item) => item.page === pageNumber);
      if (!page) throw new Error(`Unknown page ${pageNumber} for ${scanId}`);
      page.status = status;
      page.completedAt = status === "done" ? new Date().toISOString() : null;
      page.claimedAt = null;
      page.summary = summaryParts.join(" ") || page.summary;
    }
    save(lockedState);
  } finally {
    releaseLock();
  }
  console.log(`${scanId} ${pagesValue} -> ${status}`);
} else {
  throw new Error(`Unknown command: ${command}`);
}
