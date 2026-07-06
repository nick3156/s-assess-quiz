# 定期校閲ルール

## 対象

- メンバー指導
- 労務管理
- 計数入門

## 原則

- iCloud共有フォルダ内のスキャンPDFは原本として直接編集しない。
- iCloud共有フォルダ内の文字起こしMarkdownは、清書済み成果物として更新対象にする。
- 校閲作業の主対象は `source-review/cleaned/` のMarkdown。各回の最後に、該当科目のiCloud Markdownにも同じ清書内容を同期する。
- 現在の `source-review/cleaned/` は全面的なスキャン照合済みではない。薄い節は要約ではなく欠落候補として扱う。
- 一文一句の完全一致ではなく、教材として意味が正しく、内容理解に支障がないことを重視する。
- OCR結果の字面だけに従わない。PDFスキャンの見え方、前後文脈、章内の用語体系から自然な本文を推定する。
- 明らかな脱字、誤変換、語順崩れ、見出し崩れ、箇条書き崩れは、文脈から正しい文章に直す。
- 表、グラフ、図表は省略しない。
  - 表はMarkdown表として復元する。
  - 計算式は読みやすい数式、またはコードブロックで復元する。
  - グラフは、タイトル、軸、単位、系列、増減傾向、本文上の読み取りポイントをMarkdown本文に反映する。
  - 視覚的な形そのものが理解に必要な図は、画像切り出し・図表化が必要な残課題として `coverage-audit.md` に記録する。
- 判断理由と作業箇所は `review-notes.md` または `scan-audit.md` に残す。

## 労務管理の追加原則

- 法制度、数値、義務、対象者、期限、届出要件は教材だけで確定しない。
- 厚生労働省など公的情報で現行制度を確認し、教材と差がある場合は `law-audit.md` に残す。
- 問題化する本文は、試験教材の文脈を保ちつつ、現行制度として誤解を招かない表現にする。

## 1回の作業量

- 原則として1回につき4見開き相当を処理する。このスキャンではPDF 1ページがほぼ1見開きなので、PDF 4ページ程度、印刷ページ約8ページに相当する。
- 労務管理で法確認が多い範囲は3見開き相当まで減らしてよい。
- 労務管理で法確認が多い場合や判断保留が多い場合は、分量より正確性を優先し、途中で止めて残課題を記録してよい。
- 大きな章を一気に直そうとしない。
- 迷う箇所は無理に断定せず、`要原本確認` または `法確認継続` として記録する。

## ページ進捗管理

- ページ単位の進捗台帳は `source-review/proofreading-progress.json`。
- 作業開始時に `npm run progress:textbook -- status` を実行し、全体進捗を確認する。
- 次に処理するページは `npm run progress:textbook -- claim 4` で確保する。
- 自動実行では、claimされたページだけを処理する。任意に別ページへ飛ばない。
- 完了したページは `npm run progress:textbook -- done <scan-id> <pages> "<summary>"` で記録する。
- 判断保留のページは `npm run progress:textbook -- needs-review <scan-id> <pages> "<reason>"` で記録する。
- `in_progress` のまま12時間以上経過したページは、次回以降のclaim対象に戻る。

## 作業手順

1. `source-review/scan-audit.md` と `source-review/review-notes.md` を読む。
2. `npm run progress:textbook -- status` で進捗を確認する。
3. `npm run progress:textbook -- claim 4` で今回処理するページを確保する。
4. `source-review/coverage-audit.md` と `npm run audit:textbook` の結果を見て、claim済みページ内の本文量が薄い節・箇条書きだけの節を優先する。
5. 対応するPDFスキャンを読む。必要に応じてOCR抽出も行うが、OCR字面だけを根拠にしない。
6. 校閲版Markdownと照合し、意味がずれている箇所、読みにくい箇所、誤字・脱字、本文・POINT・Case・ADVICE・図表説明の欠落を修正する。
7. 労務管理で制度・数値が出る場合は、必要に応じて公的情報を確認する。
8. 修正した校閲版Markdownを、対応するiCloud Markdownにも反映する。原則として `npm run sync:icloud -- member` または `npm run sync:icloud -- roumu` を使う。
9. 修正内容、根拠、残課題を `review-notes.md` / `scan-audit.md` / `coverage-audit.md` / `law-audit.md` に追記する。
10. 完了したページは `npm run progress:textbook -- done <scan-id> <pages> "<summary>"` で記録する。保留は `needs-review` で記録する。
11. アプリ表示に影響する本文を変更した場合は `npm run build` を実行する。

## スキャン候補

- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/メンバー指導①.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/メンバー指導②.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/労務管理①.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/労務管理②.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/計数①.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/計数②.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/計数③.pdf`
- `/Users/koo/Library/Mobile Documents/com~apple~CloudDocs/01_仕事_MK調剤/08_試験_アセスメント/Sアセス試験/2026/テキストスキャン/計数④.pdf`
