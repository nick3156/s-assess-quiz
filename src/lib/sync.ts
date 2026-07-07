import type { AnswerRecord } from "../types";

// 端末間同期。同期キーを進捗タブで1回設定すると、起動時にpull+push、回答ごとにpushする。
// サーバー側は追記専用+重複排除なので、順序や多重送信を気にしなくてよい

const keyStorage = "s-assess-sync-key";

export function getSyncKey() {
  try {
    return localStorage.getItem(keyStorage) ?? "";
  } catch {
    return "";
  }
}

export function setSyncKey(value: string) {
  localStorage.setItem(keyStorage, value.trim());
}

async function api(method: "GET" | "POST", body?: unknown) {
  const key = getSyncKey();
  if (!key) return null;
  const response = await fetch("/api/answers", {
    method,
    headers: {
      "X-Sync-Key": key,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`sync ${method} failed: ${response.status}`);
  return response.json();
}

export async function pullAnswers(): Promise<AnswerRecord[] | null> {
  const data = (await api("GET")) as { answers: AnswerRecord[] } | null;
  return data ? data.answers : null;
}

export async function pushAnswers(answers: AnswerRecord[]) {
  if (!answers.length) return;
  await api("POST", { answers });
}
