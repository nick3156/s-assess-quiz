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

// ISO時刻 (UTC) をローカル日付キーに変換。startsWith比較だと日本時間の朝9時前がずれる
export function localDayKey(isoString: string) {
  return todayKey(new Date(isoString));
}

function daysBetween(fromKey: string, toKey: string) {
  const [fromYear, fromMonth, fromDay] = fromKey.split("-").map(Number);
  const [toYear, toMonth, toDay] = toKey.split("-").map(Number);
  const from = new Date(fromYear, fromMonth - 1, fromDay).getTime();
  const to = new Date(toYear, toMonth - 1, toDay).getTime();
  return Math.round((to - from) / 86400000);
}

// 弱点 = 間隔反復 (SRS) の復習期日が来ている問題。
// 間違えた問題は当日中の解き直し可+翌日に再出題、正解すると3日後、
// 2連続正解で卒業。途中でまた間違えたら振り出しに戻る
export function srsDueQuestionIds(answers: AnswerRecord[], dateKey: string) {
  const history = new Map<string, AnswerRecord[]>();
  for (const answer of answers) {
    const list = history.get(answer.questionId);
    if (list) list.push(answer);
    else history.set(answer.questionId, [answer]);
  }
  const due = new Set<string>();
  for (const [questionId, records] of history) {
    records.sort((a, b) => a.answeredAt.localeCompare(b.answeredAt));
    let lastWrongIndex = -1;
    for (let index = records.length - 1; index >= 0; index -= 1) {
      if (!records[index].isCorrect) {
        lastWrongIndex = index;
        break;
      }
    }
    if (lastWrongIndex === -1) continue; // 一度も間違えていない
    const correctStreak = records.length - 1 - lastWrongIndex;
    if (correctStreak >= 2) continue; // 卒業
    const lastDay = localDayKey(records[records.length - 1].answeredAt);
    if (correctStreak === 0 && lastDay === dateKey) {
      due.add(questionId);
      continue;
    }
    const interval = correctStreak === 0 ? 1 : 3;
    if (daysBetween(lastDay, dateKey) >= interval) due.add(questionId);
  }
  return due;
}

// 今日解いた問題ID
export function answeredTodayIds(answers: AnswerRecord[], dateKey: string) {
  const ids = new Set<string>();
  for (const answer of answers) {
    if (localDayKey(answer.answeredAt) === dateKey) ids.add(answer.questionId);
  }
  return ids;
}
