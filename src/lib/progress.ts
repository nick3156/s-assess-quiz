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
