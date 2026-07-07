// 回答記録の端末間同期API (Cloudflare Pages Functions + D1)
// 認証: X-Sync-Key ヘッダーが Pages secret の SYNC_KEY と一致すること
// データは追記専用。(question_id, answered_at) が主キーで、重複はINSERT OR IGNOREで排除

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function authorized(request, env) {
  return Boolean(env.SYNC_KEY) && request.headers.get("X-Sync-Key") === env.SYNC_KEY;
}

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  const { results } = await env.DB.prepare(
    "SELECT question_id, answered_at, is_correct, selected_indexes FROM answers ORDER BY answered_at",
  ).all();
  const answers = results.map((row) => ({
    questionId: row.question_id,
    answeredAt: row.answered_at,
    isCorrect: Boolean(row.is_correct),
    selectedIndexes: JSON.parse(row.selected_indexes),
  }));
  return json({ answers });
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  const body = await request.json().catch(() => null);
  const candidates = Array.isArray(body?.answers) ? body.answers : [];
  const valid = candidates
    .filter(
      (answer) =>
        typeof answer?.questionId === "string" &&
        typeof answer?.answeredAt === "string" &&
        typeof answer?.isCorrect === "boolean" &&
        Array.isArray(answer?.selectedIndexes),
    )
    .slice(0, 50000);

  const statement = env.DB.prepare(
    "INSERT OR IGNORE INTO answers (question_id, answered_at, is_correct, selected_indexes) VALUES (?1, ?2, ?3, ?4)",
  );
  let inserted = 0;
  for (let index = 0; index < valid.length; index += 50) {
    const chunk = valid
      .slice(index, index + 50)
      .map((answer) =>
        statement.bind(
          answer.questionId,
          answer.answeredAt,
          answer.isCorrect ? 1 : 0,
          JSON.stringify(answer.selectedIndexes),
        ),
      );
    const results = await env.DB.batch(chunk);
    inserted += results.reduce((sum, result) => sum + (result.meta?.changes ?? 0), 0);
  }
  const total = await env.DB.prepare("SELECT COUNT(*) AS n FROM answers").first("n");
  return json({ inserted, total });
}
