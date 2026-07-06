# source-review

Sアセス一次対策アプリ用の教材校閲作業フォルダ。

## 目的

文字起こし済み教材をそのまま問題化せず、OCR誤り・知識上の破綻・法改正で古くなった表現を確認してから問題データへ変換する。

## ファイル

- `cleaned/keisu_nyumon_reviewed.md` - 計数入門の校閲版
- `cleaned/member_shido_reviewed.md` - メンバー指導の校閲版
- `cleaned/roumu_kanri_reviewed.md` - 労務管理の校閲版
- `review-notes.md` - 修正理由、要確認箇所、次の作業
- `scan-audit.md` - スキャン原本との照合記録
- `law-audit.md` - 労務管理の法令照合メモ
- `calculation-audit.md` - 計数入門の計算照合メモ

## 運用

- iCloud共有フォルダ内の原文は編集しない。
- 確定修正は `cleaned/` 側に反映する。
- 原本照合が必要な箇所は `review-notes.md` に残す。
- アプリ用問題は、校閲版を出典として作成する。

## 校閲の優先順位

- 労務管理の制度・数値・義務は、教材原本より最新の公的情報を優先する。
- メンバー指導の分類・順序・教材固有表現は、原本を優先する。
- 一般用語は、原本の読み取りが不鮮明な場合、知識と外部根拠を確認して自然な表記を採用する。
- 原本から変えた箇所は、理由を `review-notes.md`、法令根拠を `law-audit.md`、スキャン照合根拠を `scan-audit.md` に残す。
