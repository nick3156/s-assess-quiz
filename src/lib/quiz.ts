import type { AnswerRecord, QuizQuestion } from "../types";

// 日付文字列から決定的な乱数を作る (同じ日は同じ出題になる)
function hashSeed(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number) {
  const random = mulberry32(seed);
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DAILY_COUNT = 5;

// 日替わりの5問。科目をまたいで満遍なく混ざるよう、科目ごとにシャッフルして交互に取る
export function dailyQuestionSet(pool: QuizQuestion[], dateKey: string) {
  const seed = hashSeed(`daily-${dateKey}`);
  const subjects = Array.from(new Set(pool.map((question) => question.subjectId)));
  const perSubject = subjects.map((subjectId, index) =>
    seededShuffle(
      pool.filter((question) => question.subjectId === subjectId),
      seed + index,
    ),
  );
  const orderedSubjects = seededShuffle(perSubject, seed);
  const picked: QuizQuestion[] = [];
  let cursor = 0;
  while (picked.length < Math.min(DAILY_COUNT, pool.length)) {
    const bucket = orderedSubjects[cursor % orderedSubjects.length];
    const next = bucket.shift();
    if (next) picked.push(next);
    cursor += 1;
    if (orderedSubjects.every((subjectPool) => subjectPool.length === 0)) break;
  }
  return picked;
}

// 選択肢の表示順シャッフル。日と問題IDで固定なので、同じ日に解き直しても順序は変わらない
export function optionDisplayOrder(question: QuizQuestion, dateKey: string) {
  const indexes = question.options.map((_, index) => index);
  return seededShuffle(indexes, hashSeed(`${question.id}-${dateKey}`));
}

// 各問題の最新回答
export function latestAnswerMap(answers: AnswerRecord[]) {
  const map = new Map<string, AnswerRecord>();
  for (const answer of answers) {
    map.set(answer.questionId, answer);
  }
  return map;
}

// 弱点 = 最新回答が誤答の問題
export function weakQuestionIds(answers: AnswerRecord[]) {
  const ids = new Set<string>();
  for (const [questionId, answer] of latestAnswerMap(answers)) {
    if (!answer.isCorrect) ids.add(questionId);
  }
  return ids;
}

// 今日解いた問題ID
export function answeredTodayIds(answers: AnswerRecord[], dateKey: string) {
  const ids = new Set<string>();
  for (const answer of answers) {
    if (answer.answeredAt.startsWith(dateKey)) ids.add(answer.questionId);
  }
  return ids;
}
