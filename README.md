# s-assess-quiz

Sアセス一次試験対策のスマホ向け学習アプリ。問題演習を中心に、解説から内蔵教科書の該当箇所へ移動できるようにする。

公開URL: https://s-assess-quiz.pages.dev/

現在のURLはスマホ実機確認用のCloudflare Pages公開URL。教科書本文を内蔵するため、本運用ではCloudflare Access等のアクセス制限を検討する。

## 状態 (2026-06-30)

2027年のSアセス再受験に向けて、一次試験対策アプリとして再整備中。

当面は一次対策に集中する。二次試験は職場改善・グループ討議の評価が中心で、クイズアプリとの相性が低いため、別枠のケース演習・評価観点整理として扱う。

既存の単一HTMLクイズは `legacy-index.html` に保存し、React/Vite PWAとして作り直している。

2026-07-06時点で、メンバー指導・労務管理・計数入門のスキャン照合とiCloud Markdown同期は一通り完了。アプリ作成へ移行中。

## 特徴

- メンバー指導・労務管理・計数入門の教科書を内蔵
- 問題は4肢正誤の複数選択形式。正答数は解答表示まで非表示
- 問題ごとに出典見出し・引用・解説を保持
- 解説から教科書の該当箇所へジャンプ
- 回答履歴を localStorage に保存
- 問題追加時は校閲済み教科書チャンクを根拠にする

## ファイル

- `index.html` — Viteアプリ入口
- `legacy-index.html` — 旧単一HTMLクイズ
- `mockup.html` — React/Vite PWAへ作り直す前のスマホUIモックアップ
- `textbook-mockup.html` — 電子教科書タブのスマホ向けUIモックアップ。右端レール目次、章ジャンプ、縦スクロール本文の検証用
- `src/` — Reactアプリ本体
- `source-review/` — 2027年受験向けに、一次試験教材の文字起こしを校閲する作業フォルダ

## ローカルで動かす

```
npm install
npm run dev
```

ローカルURL: http://127.0.0.1:5173/

## ビルド

```
npm run build
```

## デプロイ

Cloudflare Pagesに `dist/` をデプロイする。

```
npm run build
npx wrangler pages deploy dist --project-name s-assess-quiz --branch main
```

## iCloud Markdown同期

校閲済みMarkdownをiCloud側の文字起こしMarkdownへ反映する。

```
npm run sync:icloud -- member
npm run sync:icloud -- roumu
npm run sync:icloud -- keisu
```

## 日次生成の方針

pharm-study方式を参考に、GitHub Actionsで毎日問題だけを追加する想定。自由生成ではなく、校閲済み教科書チャンクを根拠にして、`sourceRef` 付きの問題データを生成する。生成後は型チェック、重複チェック、ビルド検証が通った場合だけ反映する。

問題生成は `source-review/cleaned/` の校閲済みMarkdownを対象にする。労務管理の法令数値・義務・期限・対象者要件は、問題化前に `source-review/law-audit.md` を確認する。

問題追加・作り直しの作業ルールは `source-review/question-generation.md`。問題を編集したら次を実行する。

```
npm run audit:questions
npm run build
```

## 自動実行

- Codex automation `Sアセス教材の定期校閲`
- 毎日 0:00 / 4:00 / 9:00 / 14:00 / 19:00 にローカル環境で実行
- 1回の分量は原則4見開き相当（このスキャンではPDF 4ページ程度、印刷ページ約8ページ）。労務管理で法確認が多い場合は3見開き相当まで落として正確性を優先
- 対象はメンバー指導・労務管理・計数入門
- 作業ルールは `source-review/proofreading-routine.md`
- ページ単位の進捗台帳は `source-review/proofreading-progress.json`
- 次に処理するページは `npm run progress:textbook -- claim 4` で確保し、完了時に `npm run progress:textbook -- done <scan-id> <pages>` で記録する
- 全ページのスキャン照合は一通り完了済み。今後は問題化時に必要箇所を追加確認する
- iCloud側の文字起こしMarkdownも、清書済み成果物として更新対象。同期は `npm run sync:icloud -- <subject>` を使う
