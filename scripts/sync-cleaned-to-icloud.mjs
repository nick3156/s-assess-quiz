import { copyFileSync, statSync } from "node:fs";
import { dirname } from "node:path";

const pairs = {
  member: {
    source: "source-review/cleaned/member_shido_reviewed.md",
    target:
      "/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/メンバー指導_文字起こし.md",
  },
  roumu: {
    source: "source-review/cleaned/roumu_kanri_reviewed.md",
    target:
      "/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/労務管理_文字起こし.md",
  },
  keisu: {
    source: "source-review/cleaned/keisu_nyumon_reviewed.md",
    target:
      "/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/計数入門_文字起こし.md",
  },
};

const requested = process.argv.slice(2);
const subjects = requested.length > 0 ? requested : Object.keys(pairs);

for (const subject of subjects) {
  const pair = pairs[subject];
  if (!pair) {
    throw new Error(`Unknown subject: ${subject}`);
  }

  statSync(pair.source);
  statSync(dirname(pair.target));
  copyFileSync(pair.source, pair.target);
  console.log(`${subject}: ${pair.source} -> ${pair.target}`);
}
