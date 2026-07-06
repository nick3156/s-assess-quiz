import memberRaw from "../../source-review/cleaned/member_shido_reviewed.md?raw";
import roumuRaw from "../../source-review/cleaned/roumu_kanri_reviewed.md?raw";
import keisuRaw from "../../source-review/cleaned/keisu_nyumon_reviewed.md?raw";
import type { TextbookSource } from "../types";

export const textbooks: TextbookSource[] = [
  {
    id: "member",
    title: "メンバー指導",
    shortTitle: "メンバー",
    reviewStatus: "reviewed",
    raw: memberRaw,
  },
  {
    id: "roumu",
    title: "労務管理",
    shortTitle: "労務",
    reviewStatus: "reviewed",
    raw: roumuRaw,
  },
  {
    id: "keisu",
    title: "計数入門",
    shortTitle: "計数",
    reviewStatus: "reviewed",
    raw: keisuRaw,
  },
];
