import type { AnswerRecord } from "../types";

const storageKey = "s-assess-quiz-progress-v1";

export type StoredProgress = {
  answers: AnswerRecord[];
  lastQuestionId?: string;
};

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { answers: [] };
    const parsed = JSON.parse(raw) as StoredProgress;
    if (!Array.isArray(parsed.answers)) return { answers: [] };
    return parsed;
  } catch {
    return { answers: [] };
  }
}

export function saveProgress(progress: StoredProgress) {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

// バックアップの書き出し。iOSホーム画面アプリでは<a download>が効かないことがあるため共有シートを優先
export async function exportProgressFile(progress: StoredProgress) {
  const stamp = new Date().toISOString().slice(0, 10);
  const fileName = `s-assess-progress-${stamp}.json`;
  const payload = JSON.stringify(
    { app: "s-assess-quiz", exportedAt: new Date().toISOString(), ...progress },
    null,
    2,
  );
  const file = new File([payload], fileName, { type: "application/json" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: fileName });
    } catch {
      // 共有シートのキャンセルは正常系
    }
    return;
  }
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

// インポート。既存記録と結合し、同一回答 (questionId+answeredAt) は重複排除
export function mergeAnswers(current: AnswerRecord[], imported: unknown): AnswerRecord[] {
  const candidates = Array.isArray((imported as StoredProgress)?.answers)
    ? (imported as StoredProgress).answers
    : [];
  const valid = candidates.filter(
    (answer): answer is AnswerRecord =>
      typeof answer?.questionId === "string" &&
      typeof answer?.answeredAt === "string" &&
      typeof answer?.isCorrect === "boolean" &&
      Array.isArray(answer?.selectedIndexes),
  );
  const seen = new Set(current.map((answer) => `${answer.questionId}@${answer.answeredAt}`));
  const merged = [...current];
  for (const answer of valid) {
    const key = `${answer.questionId}@${answer.answeredAt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(answer);
  }
  merged.sort((a, b) => a.answeredAt.localeCompare(b.answeredAt));
  return merged;
}

export function summarizeProgress(answers: AnswerRecord[]) {
  const latestByQuestion = new Map<string, AnswerRecord>();
  for (const answer of answers) {
    latestByQuestion.set(answer.questionId, answer);
  }
  const latest = Array.from(latestByQuestion.values());
  const correct = latest.filter((answer) => answer.isCorrect).length;
  return {
    answeredCount: latest.length,
    correctCount: correct,
    wrongCount: latest.length - correct,
    accuracy: latest.length ? Math.round((correct / latest.length) * 100) : 0,
  };
}
