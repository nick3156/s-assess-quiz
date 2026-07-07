import type { SubjectId, TextbookSource } from "../types";

// 教科書本文 (計7,000行超) は初回バンドルから外し、動的importで別チャンクにする。
// これで初回ロードはクイズに必要な分だけになり、教科書は開いた時 (またはアイドル時の先読み) に届く。
const rawLoaders: Record<SubjectId, () => Promise<string>> = {
  member: () =>
    import("../../source-review/cleaned/member_shido_reviewed.md?raw").then(
      (module) => module.default,
    ),
  roumu: () =>
    import("../../source-review/cleaned/roumu_kanri_reviewed.md?raw").then(
      (module) => module.default,
    ),
  keisu: () =>
    import("../../source-review/cleaned/keisu_nyumon_reviewed.md?raw").then(
      (module) => module.default,
    ),
};

export const textbookMeta: Omit<TextbookSource, "raw">[] = [
  { id: "member", title: "メンバー指導", shortTitle: "メンバー", reviewStatus: "reviewed" },
  { id: "roumu", title: "労務管理", shortTitle: "労務", reviewStatus: "reviewed" },
  { id: "keisu", title: "計数入門", shortTitle: "計数", reviewStatus: "reviewed" },
];

let cache: Promise<TextbookSource[]> | null = null;

export function loadTextbooks(): Promise<TextbookSource[]> {
  cache ??= Promise.all(
    textbookMeta.map(async (meta) => ({ ...meta, raw: await rawLoaders[meta.id]() })),
  );
  return cache;
}
