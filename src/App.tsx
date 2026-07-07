import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactElement, TouchEvent } from "react";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  ListChecks,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { questions } from "./data/questions";
import { loadTextbooks, textbookMeta } from "./data/textbooks";
import {
  exportProgressFile,
  loadProgress,
  mergeAnswers,
  saveProgress,
  summarizeProgress,
} from "./lib/progress";
import {
  DAILY_COUNT,
  answeredTodayIds,
  dailyQuestionSet,
  latestAnswerMap,
  optionDisplayOrder,
  srsDueQuestionIds,
  todayKey,
} from "./lib/quiz";
import {
  markdownToBlocks,
  parseTextbook,
  resolveSourceSection,
  uniqueChapters,
} from "./lib/textbook";
import { getSyncKey, pullAnswers, pushAnswers, setSyncKey } from "./lib/sync";
import type {
  AnswerRecord,
  QuizQuestion,
  SubjectId,
  TextbookSection,
  TextbookSource,
} from "./types";

type View = "home" | "quiz" | "book" | "progress";
type QuizMode = "daily" | "weak" | "subject";

const enabledSubjects: SubjectId[] = ["member", "roumu", "keisu"];

const subjectLabel: Record<SubjectId, string> = {
  member: "メンバー指導",
  roumu: "労務管理",
  keisu: "計数入門",
};

function sameIndexes(left: number[], right: number[]) {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort((a, b) => a - b);
  const sortedRight = [...right].sort((a, b) => a - b);
  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

export function App() {
  // 教科書本文は別チャンク。初回描画を止めず、マウント直後に読み込む
  const [textbookSources, setTextbookSources] = useState<TextbookSource[] | null>(null);
  useEffect(() => {
    let alive = true;
    loadTextbooks().then((sources) => {
      if (alive) setTextbookSources(sources);
    });
    return () => {
      alive = false;
    };
  }, []);
  const textbookSections = useMemo(
    () => (textbookSources ? textbookSources.flatMap((source) => parseTextbook(source)) : []),
    [textbookSources],
  );
  const dateKey = todayKey();
  const dailyQuestions = useMemo(() => dailyQuestionSet(questions, dateKey), [dateKey]);

  const [view, setView] = useState<View>("home");
  const [quizMode, setQuizMode] = useState<QuizMode>("daily");
  const [quizSubject, setQuizSubject] = useState<SubjectId>("member");
  const [dailyReplay, setDailyReplay] = useState(false);
  const [activeSubject, setActiveSubject] = useState<SubjectId>("member");
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>();
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion>(() => {
    return (
      questions.find((question) => question.id === loadProgress().lastQuestionId) ??
      dailyQuestionSet(questions, todayKey())[0] ??
      questions[0]
    );
  });
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSourceQuote, setActiveSourceQuote] = useState("");
  const [syncStatus, setSyncStatus] = useState<"off" | "syncing" | "ok" | "error">(() =>
    getSyncKey() ? "syncing" : "off",
  );

  // 端末間同期: サーバーの記録をpullしてローカルと結合し、結合結果をpush (サーバー側で重複排除)
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const syncNow = useCallback(async () => {
    if (!getSyncKey()) {
      setSyncStatus("off");
      return;
    }
    setSyncStatus("syncing");
    try {
      const remote = await pullAnswers();
      const merged = remote
        ? mergeAnswers(progressRef.current.answers, { answers: remote })
        : progressRef.current.answers;
      const nextProgress = { ...progressRef.current, answers: merged };
      setProgress(nextProgress);
      saveProgress(nextProgress);
      await pushAnswers(merged);
      setSyncStatus("ok");
    } catch {
      setSyncStatus("error");
    }
  }, []);
  useEffect(() => {
    void syncNow();
  }, [syncNow]);

  const summary = summarizeProgress(progress.answers);
  const latestByQuestion = useMemo(() => latestAnswerMap(progress.answers), [progress.answers]);
  const weakIds = useMemo(
    () => srsDueQuestionIds(progress.answers, dateKey),
    [progress.answers, dateKey],
  );
  const todayIds = useMemo(
    () => answeredTodayIds(progress.answers, dateKey),
    [progress.answers, dateKey],
  );

  const quizPool = useMemo(() => {
    if (quizMode === "daily") return dailyQuestions;
    if (quizMode === "weak") return questions.filter((question) => weakIds.has(question.id));
    return questions.filter((question) => question.subjectId === quizSubject);
  }, [quizMode, dailyQuestions, weakIds, quizSubject]);

  const dailyAnswered = dailyQuestions.filter((question) => todayIds.has(question.id));
  const dailyCorrect = dailyAnswered.filter(
    (question) => latestByQuestion.get(question.id)?.isCorrect,
  ).length;
  const dailyDone = dailyQuestions.length > 0 && dailyAnswered.length >= dailyQuestions.length;

  const latestAnswer = progress.answers
    .filter((answer) => answer.questionId === activeQuestion.id)
    .at(-1);
  const activeSections = textbookSections.filter(
    (section) => section.subjectId === activeSubject,
  );
  const filteredSections = activeSections.filter((section) =>
    section.searchableText.includes(query.toLowerCase()),
  );
  const activeSection =
    textbookSections.find((section) => section.id === activeSectionId) ??
    filteredSections[0] ??
    activeSections[0];

  const subjectStats = enabledSubjects.map((subjectId) => {
    const subjectQuestions = questions.filter((question) => question.subjectId === subjectId);
    const answered = subjectQuestions.filter((question) => latestByQuestion.has(question.id));
    return {
      subjectId,
      total: subjectQuestions.length,
      answered: answered.length,
      percent: subjectQuestions.length
        ? Math.round((answered.length / subjectQuestions.length) * 100)
        : 0,
    };
  });

  function toggleAnswer(index: number) {
    if (showExplanation) return;
    setSelectedIndexes((current) =>
      current.includes(index)
        ? current.filter((selectedIndex) => selectedIndex !== index)
        : [...current, index],
    );
  }

  function revealAnswer() {
    if (!selectedIndexes.length || showExplanation) return;
    setShowExplanation(true);
    const answer: AnswerRecord = {
      questionId: activeQuestion.id,
      selectedIndexes,
      isCorrect: sameIndexes(selectedIndexes, activeQuestion.correctIndexes),
      answeredAt: new Date().toISOString(),
    };
    const nextProgress = {
      answers: [...progress.answers, answer],
      lastQuestionId: activeQuestion.id,
    };
    setProgress(nextProgress);
    saveProgress(nextProgress);
    // 端末間同期 (キー未設定・オフライン時は静かにスキップ。起動時の全件pushで回収される)
    void pushAnswers([answer]).catch(() => {});
  }

  function goToQuestion(question: QuizQuestion) {
    setActiveQuestion(question);
    setSelectedIndexes([]);
    setShowExplanation(false);
    const nextProgress = { ...progress, lastQuestionId: question.id };
    setProgress(nextProgress);
    saveProgress(nextProgress);
    setView("quiz");
  }

  function enterQuizMode(mode: QuizMode, subject?: SubjectId) {
    setQuizMode(mode);
    setDailyReplay(false);
    if (subject) setQuizSubject(subject);
    let pool: QuizQuestion[];
    if (mode === "daily") pool = dailyQuestions;
    else if (mode === "weak") pool = questions.filter((question) => weakIds.has(question.id));
    else
      pool = questions.filter(
        (question) => question.subjectId === (subject ?? quizSubject),
      );
    const target =
      mode === "daily"
        ? pool.find((question) => !todayIds.has(question.id)) ?? pool[0]
        : pool[0];
    if (target) {
      goToQuestion(target);
    } else {
      setSelectedIndexes([]);
      setShowExplanation(false);
      setView("quiz");
    }
  }

  function goToNext() {
    const index = quizPool.findIndex((question) => question.id === activeQuestion.id);
    if (quizMode === "daily" && dailyDone && !dailyReplay) {
      // 今日の分を解き終えたら完了カードを見せる
      setSelectedIndexes([]);
      setShowExplanation(false);
      return;
    }
    const next = index >= 0 ? quizPool[(index + 1) % quizPool.length] : quizPool[0];
    if (next) goToQuestion(next);
  }

  function openSource(question: QuizQuestion) {
    const section = resolveSourceSection(
      textbookSections,
      question.sourceRef.subjectId,
      question.sourceRef.heading,
    );
    setActiveSubject(question.sourceRef.subjectId);
    setActiveSectionId(section?.id);
    setActiveSourceQuote(question.sourceRef.quote);
    setQuery("");
    setView("book");
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {view === "home" && (
          <HomeView
            summary={summary}
            subjectStats={subjectStats}
            dailyAnsweredCount={dailyAnswered.length}
            dailyCorrect={dailyCorrect}
            dailyDone={dailyDone}
            weakCount={weakIds.size}
            onStart={() => enterQuizMode("daily")}
            onReview={() => enterQuizMode("weak")}
          />
        )}

        {view === "quiz" && (
          <QuizView
            question={activeQuestion}
            pool={quizPool}
            mode={quizMode}
            subject={quizSubject}
            dateKey={dateKey}
            selectedIndexes={selectedIndexes}
            showExplanation={showExplanation}
            latestAnswer={latestAnswer}
            dailyDone={dailyDone}
            dailyReplay={dailyReplay}
            dailyCorrect={dailyCorrect}
            weakCount={weakIds.size}
            onModeChange={(mode) => enterQuizMode(mode)}
            onSubjectChange={(subject) => enterQuizMode("subject", subject)}
            onToggleAnswer={toggleAnswer}
            onRevealAnswer={revealAnswer}
            onNext={goToNext}
            onReplayDaily={() => {
              setDailyReplay(true);
              const target = dailyQuestions[0];
              if (target) goToQuestion(target);
            }}
            onReview={() => enterQuizMode("weak")}
            onOpenBook={() => openSource(activeQuestion)}
            onBackHome={() => setView("home")}
          />
        )}

        {view === "book" && !activeSection && (
          <section className="screen">
            <p className="book-loading">教科書を読み込んでいます…</p>
          </section>
        )}

        {view === "book" && activeSection && (
          <BookView
            sections={activeSections}
            filteredSections={filteredSections}
            activeSection={activeSection}
            activeSubject={activeSubject}
            query={query}
            activeSourceQuote={activeSourceQuote}
            onQueryChange={setQuery}
            onSubjectChange={(subjectId) => {
              setActiveSubject(subjectId);
              setActiveSectionId(undefined);
              setActiveSourceQuote("");
              setQuery("");
            }}
            onSelectSection={(section) => {
              setActiveSectionId(section.id);
              setActiveSourceQuote("");
            }}
            onBackToQuestion={() => setView("quiz")}
          />
        )}

        {view === "progress" && (
          <ProgressView
            summary={summary}
            subjectStats={subjectStats}
            onReset={() => {
              if (!window.confirm("回答履歴をすべて削除する。よい?")) return;
              const nextProgress = { answers: [] };
              setProgress(nextProgress);
              saveProgress(nextProgress);
            }}
            onExport={() => {
              void exportProgressFile(progress);
            }}
            onImportFile={(file) => {
              void file.text().then((text) => {
                try {
                  const merged = mergeAnswers(progress.answers, JSON.parse(text));
                  const nextProgress = { ...progress, answers: merged };
                  setProgress(nextProgress);
                  saveProgress(nextProgress);
                  window.alert(`読み込みました (回答記録 合計${merged.length}件)`);
                } catch {
                  window.alert("読み込めませんでした。エクスポートしたJSONファイルか確認してください");
                }
              });
            }}
            syncStatus={syncStatus}
            syncKey={getSyncKey()}
            onSaveSyncKey={(key) => {
              setSyncKey(key);
              void syncNow();
            }}
          />
        )}
      </main>

      <nav className="bottom-tabs" aria-label="主要画面">
        <TabButton active={view === "home"} label="今日" onClick={() => setView("home")}>
          <Home />
        </TabButton>
        <TabButton active={view === "quiz"} label="問題" onClick={() => setView("quiz")}>
          <ListChecks />
        </TabButton>
        <TabButton active={view === "book"} label="教科書" onClick={() => setView("book")}>
          <BookOpen />
        </TabButton>
        <TabButton active={view === "progress"} label="進捗" onClick={() => setView("progress")}>
          <BarChart3 />
        </TabButton>
      </nav>
    </div>
  );
}

function HomeView({
  summary,
  subjectStats,
  dailyAnsweredCount,
  dailyCorrect,
  dailyDone,
  weakCount,
  onStart,
  onReview,
}: {
  summary: ReturnType<typeof summarizeProgress>;
  subjectStats: { subjectId: SubjectId; total: number; answered: number; percent: number }[];
  dailyAnsweredCount: number;
  dailyCorrect: number;
  dailyDone: boolean;
  weakCount: number;
  onStart: () => void;
  onReview: () => void;
}) {
  const dateLabel = new Date().toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const startLabel = dailyDone
    ? "今日の5問をもう一度"
    : dailyAnsweredCount > 0
      ? "続きから解く"
      : "今日の5問を解く";
  return (
    <section className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">{dateLabel} ・ 2027 再受験対策</p>
          <h1>今日の学習</h1>
        </div>
      </header>

      <section className="hero-panel">
        <div>
          <p className="panel-label">今日のセット</p>
          <p className="hero-number">
            {dailyAnsweredCount}
            <span> / {DAILY_COUNT}問</span>
          </p>
          {dailyDone && (
            <p className="hero-note">
              完了。正解 {dailyCorrect} / {DAILY_COUNT}
            </p>
          )}
        </div>
        <div className="ring" style={{ "--value": `${summary.accuracy}%` } as CSSProperties}>
          <span>{summary.accuracy}%</span>
          <small>正答率</small>
        </div>
        <div className="button-row">
          <button className="primary-action" onClick={onStart}>
            {startLabel}
          </button>
          <button className="secondary-action" disabled={!weakCount} onClick={onReview}>
            復習 {weakCount > 0 ? weakCount : ""}
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="学習状況">
        <Metric label="回答済み" value={`${summary.answeredCount}`} />
        <Metric label="正答率" value={`${summary.accuracy}%`} />
        <Metric label="復習待ち" value={`${weakCount}`} />
      </section>

      <section className="card">
        <div className="section-head">
          <h2>科目別</h2>
        </div>
        <div className="subject-list">
          {subjectStats.map((stat) => (
            <div className="subject-row" key={stat.subjectId}>
              <div>
                <strong>{subjectLabel[stat.subjectId]}</strong>
                <span>
                  {stat.answered} / {stat.total}問
                </span>
              </div>
              <div className="bar">
                <span style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function QuizView({
  question,
  pool,
  mode,
  subject,
  dateKey,
  selectedIndexes,
  showExplanation,
  latestAnswer,
  dailyDone,
  dailyReplay,
  dailyCorrect,
  weakCount,
  onModeChange,
  onSubjectChange,
  onToggleAnswer,
  onRevealAnswer,
  onNext,
  onReplayDaily,
  onReview,
  onOpenBook,
  onBackHome,
}: {
  question: QuizQuestion;
  pool: QuizQuestion[];
  mode: QuizMode;
  subject: SubjectId;
  dateKey: string;
  selectedIndexes: number[];
  showExplanation: boolean;
  latestAnswer?: AnswerRecord;
  dailyDone: boolean;
  dailyReplay: boolean;
  dailyCorrect: number;
  weakCount: number;
  onModeChange: (mode: QuizMode) => void;
  onSubjectChange: (subject: SubjectId) => void;
  onToggleAnswer: (index: number) => void;
  onRevealAnswer: () => void;
  onNext: () => void;
  onReplayDaily: () => void;
  onReview: () => void;
  onOpenBook: () => void;
  onBackHome: () => void;
}) {
  const displayOrder = useMemo(
    () => optionDisplayOrder(question, dateKey),
    [question, dateKey],
  );
  const poolIndex = pool.findIndex((candidate) => candidate.id === question.id);
  const poolStatus =
    mode === "daily"
      ? `今日のセット ${Math.min(poolIndex + 1, pool.length)} / ${pool.length}`
      : mode === "weak"
        ? `弱点復習 残り${pool.length}問`
        : `${subjectLabel[subject]} ${poolIndex + 1} / ${pool.length}問`;
  const correctLetters = question.correctIndexes
    .map((correctIndex) => displayOrder.indexOf(correctIndex))
    .sort((a, b) => a - b)
    .map((displayIndex) => String.fromCharCode(65 + displayIndex))
    .join("・");

  const showCompletion = mode === "daily" && dailyDone && !dailyReplay && !showExplanation;
  const showEmptyWeak = mode === "weak" && pool.length === 0;

  return (
    <section className="screen">
      <header className="topbar">
        <button className="icon-button" aria-label="ホームへ戻る" onClick={onBackHome}>
          <ChevronLeft />
        </button>
        <div className="topbar-center">
          <h1>問題</h1>
        </div>
        <button className="icon-button" aria-label="教科書を開く" onClick={onOpenBook}>
          <BookOpen />
        </button>
      </header>

      <div className="segmented">
        <button className={mode === "daily" ? "active" : ""} onClick={() => onModeChange("daily")}>
          今日
        </button>
        <button className={mode === "weak" ? "active" : ""} onClick={() => onModeChange("weak")}>
          弱点{weakCount > 0 ? ` ${weakCount}` : ""}
        </button>
        <button
          className={mode === "subject" ? "active" : ""}
          onClick={() => onModeChange("subject")}
        >
          分野
        </button>
      </div>

      {mode === "subject" && (
        <div className="subject-chips" aria-label="科目を選ぶ">
          {enabledSubjects.map((subjectId) => (
            <button
              className={subject === subjectId ? "active" : ""}
              key={subjectId}
              onClick={() => onSubjectChange(subjectId)}
            >
              {subjectLabel[subjectId]}
            </button>
          ))}
        </div>
      )}

      {showCompletion ? (
        <section className="card quiz-complete">
          <div className={dailyCorrect === pool.length ? "result-mark ok" : "result-mark warn"}>
            <Check />
          </div>
          <h2>今日の5問 完了</h2>
          <p>
            正解 {dailyCorrect} / {pool.length}。明日また新しいセットが出る。
          </p>
          <div className="button-row">
            <button className="primary-action" disabled={!weakCount} onClick={onReview}>
              弱点を復習{weakCount > 0 ? ` (${weakCount})` : ""}
            </button>
            <button className="secondary-action" onClick={onReplayDaily}>
              <RotateCcw />
              もう一度
            </button>
          </div>
        </section>
      ) : showEmptyWeak ? (
        <section className="card quiz-complete">
          <div className="result-mark ok">
            <Check />
          </div>
          <h2>復習待ちなし</h2>
          <p>誤答した問題がここに溜まる。今日のセットか分野別で解き進める。</p>
          <div className="button-row">
            <button className="primary-action" onClick={() => onModeChange("daily")}>
              今日のセットへ
            </button>
            <button className="secondary-action" onClick={() => onModeChange("subject")}>
              分野別
            </button>
          </div>
        </section>
      ) : (
        <>
          <p className="pool-status">{poolStatus}</p>

          <article className="question-card">
            <div className="question-meta">
              <span>
                {subjectLabel[question.subjectId]} / {question.topic}
              </span>
              <span className={`badge ${question.importance === "high" ? "warn" : "neutral"}`}>
                {question.importance === "high" ? "重要" : "標準"}
              </span>
            </div>
            <p className="question-text">{question.prompt}</p>
            <p className="question-hint">複数選択可・正答数は解答まで非公開</p>
          </article>

          <div className="answer-list">
            {displayOrder.map((optionIndex, displayIndex) => {
              const option = question.options[optionIndex];
              const isCorrect = question.correctIndexes.includes(optionIndex);
              const isSelected = selectedIndexes.includes(optionIndex);
              const status = showExplanation
                ? isCorrect && isSelected
                  ? "correct"
                  : isCorrect
                    ? "missed"
                    : isSelected
                      ? "wrong"
                      : "muted"
                : isSelected
                  ? "selected"
                  : "";
              return (
                <button
                  className={`answer ${status}`}
                  key={option}
                  onClick={() => onToggleAnswer(optionIndex)}
                  aria-pressed={isSelected}
                >
                  <span>{String.fromCharCode(65 + displayIndex)}</span>
                  <strong>{option}</strong>
                  {showExplanation && isCorrect && isSelected && (
                    <Check className="answer-glyph ok" aria-label="正解" />
                  )}
                  {showExplanation && isCorrect && !isSelected && (
                    <em className="answer-flag">見落とし</em>
                  )}
                  {showExplanation && !isCorrect && isSelected && (
                    <X className="answer-glyph ng" aria-label="誤り" />
                  )}
                </button>
              );
            })}
          </div>

          {!showExplanation && (
            <button
              className="dark-action quiz-reveal"
              disabled={!selectedIndexes.length}
              onClick={onRevealAnswer}
            >
              解答を見る
              <ChevronRight />
            </button>
          )}

          {showExplanation && (
            <section className="card explanation">
              <div className="result-line">
                <div className={latestAnswer?.isCorrect ? "result-mark ok" : "result-mark ng"}>
                  {latestAnswer?.isCorrect ? <Check /> : <X />}
                </div>
                <div>
                  <p className="eyebrow">正解は {correctLetters}</p>
                  <h2>{latestAnswer?.isCorrect ? "正解" : "要復習"}</h2>
                </div>
              </div>
              <p>{question.explanation}</p>
              <div className="source-box">
                <p className="panel-label">教科書にはこう書いてある</p>
                <blockquote>{question.sourceRef.quote}</blockquote>
              </div>
              <div className="button-row">
                <button className="dark-action" onClick={onOpenBook}>
                  教科書で確認
                  <ChevronRight />
                </button>
                <button className="secondary-action" onClick={onNext}>
                  次の問題
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </section>
  );
}

function makeSnippet(section: TextbookSection, query: string) {
  const flat = section.body.replace(/[#>*|`]/g, "").replace(/\s+/g, " ").trim();
  const position = flat.toLowerCase().indexOf(query.toLowerCase());
  if (position < 0) return flat.slice(0, 56);
  const start = Math.max(0, position - 20);
  return `${start > 0 ? "…" : ""}${flat.slice(start, position + query.length + 44)}…`;
}

function BookView({
  sections,
  filteredSections,
  activeSection,
  activeSubject,
  query,
  activeSourceQuote,
  onQueryChange,
  onSubjectChange,
  onSelectSection,
  onBackToQuestion,
}: {
  sections: TextbookSection[];
  filteredSections: TextbookSection[];
  activeSection: TextbookSection;
  activeSubject: SubjectId;
  query: string;
  activeSourceQuote: string;
  onQueryChange: (query: string) => void;
  onSubjectChange: (subjectId: SubjectId) => void;
  onSelectSection: (section: TextbookSection) => void;
  onBackToQuestion: () => void;
}) {
  const [tocOpen, setTocOpen] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accessHidden, setAccessHidden] = useState(false);
  const [visibleSectionId, setVisibleSectionId] = useState(activeSection.id);
  const [scrubCursorIndex, setScrubCursorIndex] = useState(-1);
  const edgeRef = useRef<HTMLElement | null>(null);
  const accessBarRef = useRef<HTMLDivElement | null>(null);
  const chapterStripRef = useRef<HTMLElement | null>(null);
  const scrollProgressRef = useRef<HTMLSpanElement | null>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const scrubTargetsRef = useRef<{ id: string; y: number }[]>([]);
  const activeScrubIndexRef = useRef(-1);
  const isScrubbingRef = useRef(false);
  const accessHiddenRef = useRef(false);
  const updateRailRef = useRef<() => void>(() => {});
  const chapters = uniqueChapters(sections);
  const visibleSection = sections.find((section) => section.id === visibleSectionId) ?? activeSection;
  const activeChapter = visibleSection.chapterTitle;
  const navSections = query ? filteredSections : sections;
  const activeNavIndex = Math.max(
    0,
    navSections.findIndex((section) => section.id === visibleSectionId),
  );
  const displayedScrubIndex = isScrubbing && scrubCursorIndex >= 0
    ? scrubCursorIndex
    : activeNavIndex;

  useEffect(() => {
    accessHiddenRef.current = accessHidden;
    const timer = window.setTimeout(() => updateRailRef.current(), 240);
    return () => window.clearTimeout(timer);
  }, [accessHidden]);

  // 現在章のボタンが章ストリップの見える位置に来るよう追従させる
  useEffect(() => {
    const strip = chapterStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLButtonElement>("button.active");
    if (!active) return;
    const target = active.offsetLeft - (strip.clientWidth - active.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeChapter, searchOpen]);

  function moveToChapter(chapter: string) {
    const firstSection = sections.find((section) => section.chapterTitle === chapter);
    if (firstSection) moveToSection(firstSection);
  }

  function moveToSection(section: TextbookSection, behavior: ScrollBehavior = "smooth") {
    onSelectSection(section);
    setVisibleSectionId(section.id);
    window.requestAnimationFrame(() => {
      document.getElementById(section.id)?.scrollIntoView({
        block: "start",
        behavior,
      });
    });
  }

  function jumpToResult(section: TextbookSection) {
    setSearchOpen(false);
    onQueryChange("");
    moveToSection(section, "auto");
  }

  useEffect(() => {
    if (!activeSourceQuote) {
      setVisibleSectionId(activeSection.id);
      return;
    }
    window.requestAnimationFrame(() => {
      document.getElementById(activeSection.id)?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      setVisibleSectionId(activeSection.id);
    });
  }, [activeSection.id, activeSourceQuote]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrubbing) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        if (visible?.target.id) setVisibleSectionId(visible.target.id);
      },
      {
        rootMargin: "-30% 0px -58% 0px",
        threshold: [0, 0.2, 0.55],
      },
    );

    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [isScrubbing, sections]);

  // 右端レールの上端をヘッダー下端に追従させ、スクロール方向でヘッダーを出し入れする
  useEffect(() => {
    const updateRail = () => {
      const edge = edgeRef.current;
      if (!edge) return;
      const rect = accessBarRef.current?.getBoundingClientRect();
      const top = accessHiddenRef.current || !rect ? 0 : Math.max(0, rect.bottom);
      edge.style.setProperty("--rail-top", `${Math.round(top)}px`);
    };
    updateRailRef.current = updateRail;
    updateRail();

    const observer = new ResizeObserver(updateRail);
    if (accessBarRef.current) observer.observe(accessBarRef.current);

    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgressRef.current) {
          const percent = maxScroll > 0 ? Math.min(100, Math.max(0, (y / maxScroll) * 100)) : 0;
          scrollProgressRef.current.style.width = `${percent}%`;
        }
        if (!isScrubbingRef.current) {
          if (y < 90) setAccessHidden(false);
          else if (delta > 10) setAccessHidden(true);
          else if (delta < -10) setAccessHidden(false);
        }
        updateRail();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const openToc = () => {
    window.clearTimeout(closeTimerRef.current);
    setTocOpen(true);
  };

  const closeTocSoon = () => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setTocOpen(false), 420);
  };

  const stopScrub = useCallback((commitSelection = true) => {
    if (!isScrubbingRef.current) return false;
    const target = scrubTargetsRef.current[activeScrubIndexRef.current];
    const section = target
      ? navSections.find((candidate) => candidate.id === target.id)
      : undefined;

    isScrubbingRef.current = false;
    setIsScrubbing(false);
    setScrubCursorIndex(-1);
    window.clearTimeout(closeTimerRef.current);
    setTocOpen(false);

    if (commitSelection && target && section) {
      onSelectSection(section);
      setVisibleSectionId(section.id);
    }

    return true;
  }, [navSections, onSelectSection]);

  useEffect(() => {
    const finishGlobalScrub = () => {
      stopScrub(true);
    };
    window.addEventListener("pointerup", finishGlobalScrub);
    window.addEventListener("pointercancel", finishGlobalScrub);
    window.addEventListener("touchend", finishGlobalScrub);
    window.addEventListener("touchcancel", finishGlobalScrub);
    return () => {
      window.removeEventListener("pointerup", finishGlobalScrub);
      window.removeEventListener("pointercancel", finishGlobalScrub);
      window.removeEventListener("touchend", finishGlobalScrub);
      window.removeEventListener("touchcancel", finishGlobalScrub);
    };
  }, [stopScrub]);

  const buildScrubTargets = () => {
    const accessRect = accessBarRef.current?.getBoundingClientRect();
    const offset = Math.max(0, accessRect?.bottom ?? 0) + 18;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrubTargetsRef.current = navSections.map((section) => {
      const node = document.getElementById(section.id);
      return {
        id: section.id,
        y: Math.min(
          Math.max((node?.getBoundingClientRect().top ?? 0) + window.scrollY - offset, 0),
          maxScroll,
        ),
      };
    });
  };

  const scrubToPointer = (clientY: number) => {
    const edge = edgeRef.current;
    const targets = scrubTargetsRef.current;
    if (!edge || !targets.length) return;
    const rect = edge.getBoundingClientRect();
    const localY = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const progressRatio = localY / Math.max(1, rect.height);
    const activeIndex = Math.min(
      Math.max(Math.round(progressRatio * (targets.length - 1)), 0),
      targets.length - 1,
    );

    edge.style.setProperty(
      "--scrub-y",
      `${localY}px`,
    );
    edge.style.setProperty(
      "--scrub-page-y",
      `${rect.top + localY}px`,
    );
    if (activeScrubIndexRef.current !== activeIndex) {
      activeScrubIndexRef.current = activeIndex;
      setVisibleSectionId(targets[activeIndex].id);
      setScrubCursorIndex(activeIndex);
      window.scrollTo({ top: targets[activeIndex].y, behavior: "auto" });
    }
  };

  const startScrub = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    buildScrubTargets();
    const startIndex = Math.min(Math.max(activeNavIndex, 0), Math.max(scrubTargetsRef.current.length - 1, 0));
    activeScrubIndexRef.current = startIndex;
    isScrubbingRef.current = true;
    setIsScrubbing(true);
    setScrubCursorIndex(startIndex);
    openToc();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    scrubToPointer(event.clientY);
    event.preventDefault();
  };

  const moveScrub = (event: PointerEvent<HTMLElement>) => {
    if (!isScrubbingRef.current) return;
    scrubToPointer(event.clientY);
    event.preventDefault();
  };

  const finishScrub = (event: PointerEvent<HTMLElement>) => {
    if (!isScrubbingRef.current) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    stopScrub(true);
    event.preventDefault();
  };

  const startTouchScrub = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    buildScrubTargets();
    const startIndex = Math.min(Math.max(activeNavIndex, 0), Math.max(scrubTargetsRef.current.length - 1, 0));
    activeScrubIndexRef.current = startIndex;
    isScrubbingRef.current = true;
    setIsScrubbing(true);
    setScrubCursorIndex(startIndex);
    openToc();
    scrubToPointer(touch.clientY);
    event.preventDefault();
  };

  const moveTouchScrub = (event: TouchEvent<HTMLElement>) => {
    if (!isScrubbingRef.current) return;
    const touch = event.touches[0];
    if (!touch) return;
    scrubToPointer(touch.clientY);
    event.preventDefault();
  };

  const finishTouchScrub = (event: TouchEvent<HTMLElement>) => {
    if (!isScrubbingRef.current) return;
    stopScrub(true);
    event.preventDefault();
  };

  const searchResults = query ? filteredSections.slice(0, 20) : [];

  return (
    <section className="screen book-screen">
      <header className="topbar reader-topbar">
        <button className="icon-button" aria-label="問題へ戻る" onClick={onBackToQuestion}>
          <ChevronLeft />
        </button>
        <div className="reader-topbar-title">
          <p className="eyebrow">{subjectLabel[activeSubject]}</p>
          <h1>電子教科書</h1>
        </div>
      </header>

      <div
        className={`reader-access-bar${accessHidden && !searchOpen ? " is-hidden" : ""}`}
        aria-label="教科書内ナビゲーション"
        ref={accessBarRef}
      >
        {searchOpen ? (
          <div className="reader-search-row">
            <label className="reader-search">
              <Search />
              <input
                autoFocus
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={`${subjectLabel[activeSubject]}内を検索`}
              />
            </label>
            <button
              className="search-cancel"
              onClick={() => {
                setSearchOpen(false);
                onQueryChange("");
              }}
            >
              閉じる
            </button>
          </div>
        ) : (
          <>
            <div className="reader-access-row">
              <div className="book-subject-tabs reader-subject-tabs" aria-label="教科書科目">
                {enabledSubjects.map((subjectId) => (
                  <button
                    className={activeSubject === subjectId ? "active" : ""}
                    key={subjectId}
                    onClick={() => onSubjectChange(subjectId)}
                  >
                    {textbookMeta.find((book) => book.id === subjectId)?.shortTitle}
                  </button>
                ))}
              </div>
              <button
                className="icon-button search-toggle"
                aria-label="教科書内を検索"
                onClick={() => setSearchOpen(true)}
              >
                <Search />
              </button>
            </div>

            <nav className="reader-chapter-strip" aria-label="章ジャンプ" ref={chapterStripRef}>
              {chapters.map((chapter) => (
                <button
                  className={chapter === activeChapter ? "active" : ""}
                  key={chapter}
                  onClick={() => moveToChapter(chapter)}
                >
                  {chapter}
                </button>
              ))}
            </nav>
          </>
        )}

        {searchOpen && query && (
          <div className="search-results" role="listbox" aria-label="検索結果">
            {searchResults.length === 0 && <p className="search-empty">見つからない</p>}
            {searchResults.map((section) => (
              <button key={section.id} onClick={() => jumpToResult(section)}>
                <span>{section.title}</span>
                <small>{section.chapterTitle}</small>
                <p>{makeSnippet(section, query)}</p>
              </button>
            ))}
            {filteredSections.length > searchResults.length && (
              <p className="search-empty">他 {filteredSections.length - searchResults.length} 件</p>
            )}
          </div>
        )}

        <div className="reader-scroll-progress" aria-hidden="true">
          <span ref={scrollProgressRef} />
        </div>
      </div>

      {activeSourceQuote && (
        <button className="source-jump" onClick={() => moveToSection(activeSection)}>
          <BookMarked />
          <span>問題の出典箇所を表示中</span>
          <ChevronRight />
        </button>
      )}

      <section className="reader-layout chapter-reader-layout">
        <article className="reader-card reader-scroll-page">
          <div className="reader-body">
            {sections.map((section) => {
              const isChapterHead = section.title === section.chapterTitle;
              return (
                <section
                  className={`reader-section${isChapterHead ? " reader-chapter-head" : ""}${
                    section.id === visibleSectionId ? " is-current" : ""
                  }`}
                  id={section.id}
                  key={section.id}
                >
                  {isChapterHead ? (
                    <>
                      <p className="chapter-kicker">{subjectLabel[activeSubject]}</p>
                      <h2>{section.title}</h2>
                    </>
                  ) : (
                    <h3>{section.title}</h3>
                  )}
                  {markdownToBlocks(section.body).map((block, index) => (
                    <MarkdownBlock
                      key={`${section.id}-${index}`}
                      block={block}
                      highlight={Boolean(
                        activeSourceQuote &&
                          block.replace(/\s+/g, "").includes(activeSourceQuote.replace(/\s+/g, "")),
                      )}
                    />
                  ))}
                </section>
              );
            })}
          </div>
        </article>
      </section>

      <aside
        ref={edgeRef}
        className={`reader-scrub-index${tocOpen ? " is-open" : ""}${isScrubbing ? " is-scrubbing" : ""}`}
        aria-label="右端目次"
        onPointerEnter={(event) => {
          // ホバーで開くのはマウスだけ。タッチはスクラブ開始 (pointerdown) で開く
          if (event.pointerType === "mouse") openToc();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && !isScrubbing) closeTocSoon();
        }}
        onPointerDown={startScrub}
        onPointerMove={moveScrub}
        onPointerUp={finishScrub}
        onPointerCancel={finishScrub}
        onTouchStart={startTouchScrub}
        onTouchMove={moveTouchScrub}
        onTouchEnd={finishTouchScrub}
        onTouchCancel={finishTouchScrub}
      >
        <div className="reader-scrub-zone" aria-hidden="true" />
        <div className="reader-scrub-number-rail" aria-hidden="true">
          {navSections.map((section, index) => {
            const top = navSections.length > 1 ? (index / (navSections.length - 1)) * 100 : 50;
            return (
              <span
                className={index === displayedScrubIndex ? "active" : ""}
                key={`${section.id}-num`}
                style={{ top: `${top}%` }}
              >
                {index + 1}
              </span>
            );
          })}
        </div>
        <div className="reader-scrub-tracker" aria-hidden="true">
          {displayedScrubIndex + 1}
        </div>
        <nav className="reader-scrub-panel" aria-label="目次" aria-hidden={!tocOpen}>
          <div className="reader-scrub-title">
            <span>{query ? "検索結果" : subjectLabel[activeSubject]}</span>
            <strong>{displayedScrubIndex + 1} / {navSections.length}</strong>
          </div>
          <div className="reader-scrub-list">
            {navSections.map((section, index) => {
              const offset = index - displayedScrubIndex;
              const distance = Math.abs(offset);
              const isActive = index === displayedScrubIndex;
              return (
                <button
                  className={`reader-scrub-item${isActive ? " active" : ""}`}
                  data-target={section.id}
                  key={section.id}
                  style={{
                    "--scrub-item-offset": offset,
                    "--scrub-item-y": `${offset * 57}px`,
                    "--scrub-item-shift": `${isActive ? -8 : Math.min(48, distance * 8)}px`,
                    "--scrub-item-opacity": distance > 5 ? 0 : Math.max(0.18, 1 - distance * 0.16),
                    "--scrub-item-scale": isActive ? 1.08 : Math.max(0.76, 1 - distance * 0.052),
                  } as CSSProperties}
                  onClick={() => {
                    // マウス操作 (ホバーで開いた時) はクリックでそのままジャンプ
                    setTocOpen(false);
                    moveToSection(section, "auto");
                  }}
                >
                  <span>{section.title}</span>
                  <small>{section.chapterTitle}</small>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </section>
  );
}

function ProgressView({
  summary,
  subjectStats,
  onReset,
  onExport,
  onImportFile,
  syncStatus,
  syncKey,
  onSaveSyncKey,
}: {
  summary: ReturnType<typeof summarizeProgress>;
  subjectStats: { subjectId: SubjectId; total: number; answered: number; percent: number }[];
  onReset: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  syncStatus: "off" | "syncing" | "ok" | "error";
  syncKey: string;
  onSaveSyncKey: (key: string) => void;
}) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [syncKeyDraft, setSyncKeyDraft] = useState(syncKey);
  const syncLabel = {
    off: "未設定",
    syncing: "同期中…",
    ok: "同期済み",
    error: "同期エラー",
  }[syncStatus];
  return (
    <section className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">学習記録</p>
          <h1>進捗</h1>
        </div>
        <button className="icon-button" aria-label="履歴をリセット" onClick={onReset}>
          <RotateCcw />
        </button>
      </header>

      <section className="metric-grid">
        <Metric label="回答済み" value={`${summary.answeredCount}`} />
        <Metric label="正解" value={`${summary.correctCount}`} />
        <Metric label="誤答" value={`${summary.wrongCount}`} />
      </section>

      <section className="card">
        <div className="section-head">
          <h2>科目別進捗</h2>
        </div>
        <div className="subject-list">
          {subjectStats.map((stat) => (
            <div className="subject-row" key={stat.subjectId}>
              <div>
                <strong>{subjectLabel[stat.subjectId]}</strong>
                <span>
                  {stat.answered} / {stat.total}問
                </span>
              </div>
              <span className="badge neutral">{stat.percent}%</span>
              <div className="bar">
                <span style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>端末間の同期</h2>
          <span className={`badge ${syncStatus === "error" ? "warn" : "neutral"}`}>{syncLabel}</span>
        </div>
        <p className="backup-note">
          同期キーを設定すると、回答記録がクラウド (D1) に自動保存され、他の端末と共有されます。各端末で同じキーを1回入力してください。
        </p>
        <div className="sync-row">
          <input
            type="text"
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="同期キー"
            value={syncKeyDraft}
            onChange={(event) => setSyncKeyDraft(event.target.value)}
          />
          <button className="secondary-action" onClick={() => onSaveSyncKey(syncKeyDraft)}>
            同期
          </button>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>バックアップ</h2>
        </div>
        <p className="backup-note">
          同期とは別に、記録をファイルとして書き出し/読み込みできます。
        </p>
        <div className="backup-actions">
          <button className="secondary-action" onClick={onExport}>
            記録を書き出す
          </button>
          <button className="secondary-action" onClick={() => importInputRef.current?.click()}>
            記録を読み込む
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImportFile(file);
              event.target.value = "";
            }}
          />
        </div>
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactElement<{ size?: number; strokeWidth?: number }>;
}) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      {children}
      <span>{label}</span>
    </button>
  );
}

// 本文中の **強調** を <strong> にする (太字はプレーンテキスト描画の <pre> 系では剥がす)
function renderInline(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
  );
}

function MarkdownBlock({ block, highlight }: { block: string; highlight: boolean }) {
  const cleaned = block
    .replace(/^>\s?/gm, "")
    .replace(/\n/g, "\n");
  const trimmed = cleaned.trim();
  // ラベル・ブロック種別の判定は強調記号を剥がした字面で行う (**POINT** 等も拾う)
  const plain = trimmed.replace(/\*\*/g, "");

  const tableLines = trimmed.split("\n").filter((line) => line.trim().startsWith("|"));
  const proseLines = trimmed
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("|"));
  const isMarkdownTable =
    tableLines.length >= 2 && tableLines.some((line) => /^\|\s*:?-{3,}:?\s*\|/.test(line));
  if (isMarkdownTable) {
    const rows = tableLines
      .filter((line) => !/^\|\s*:?-{3,}:?\s*\|/.test(line))
      .map((line) =>
        line
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim()),
      );
    const [head = [], ...bodyRows] = rows;
    return (
      <>
        {/* テーブルと同じブロックに地の文が混在していても捨てない */}
        {proseLines.length > 0 && (
          <p className={highlight ? "highlight" : ""}>{renderInline(proseLines.join("\n").trim())}</p>
        )}
        <div className={`reader-table-wrap${highlight ? " highlight" : ""}`}>
          <table className="reader-table">
          <thead>
            <tr>
              {head.map((cell) => (
                <th key={cell}>{renderInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </>
    );
  }

  if (/^```/.test(trimmed)) {
    return (
      <pre className={highlight ? "highlight" : ""}>
        {trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").replace(/\*\*/g, "").trim()}
      </pre>
    );
  }

  if (/^【?POINT】?$/.test(plain)) {
    return <div className="reader-label point-label">POINT</div>;
  }
  if (/^\[注釈\]$/.test(plain)) {
    return <div className="reader-label note-label">注釈</div>;
  }

  const className = [
    /^【?Case\s*\d+/i.test(plain) || plain.includes("Case ") ? "case-block" : "",
    // 図表スタイルはキャプション (行頭が図表〜) だけ。地の文の言及はボックス化しない
    /^【?図表/.test(plain) ? "figure-block" : "",
    plain.includes("用語解説") || plain.includes("[注釈]") ? "note-block" : "",
    highlight ? "highlight" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (trimmed.includes("|") || trimmed.includes("→")) {
    return <pre className={className}>{trimmed.replace(/\*\*/g, "")}</pre>;
  }

  const lines = trimmed.split("\n").filter(Boolean);

  // 番号付きリストは番号を保持して <ol> 描画 (本文が「1において…」等で項目番号を参照するため)
  const isNumberedList =
    lines.length > 1 && lines.every((line) => /^\d+[.)]\s/.test(line.trim()));
  if (isNumberedList) {
    const start = Number(lines[0].trim().match(/^(\d+)/)?.[1] ?? "1");
    return (
      <ol className={className} start={start}>
        {lines.map((line) => (
          <li key={line}>{renderInline(line.trim().replace(/^\d+[.)]\s*/, ""))}</li>
        ))}
      </ol>
    );
  }

  // 行頭の ** (強調開始) はリスト記号 * と誤認しない
  const isList =
    lines.length > 1 && lines.every((line) => /^(\d+\.|-|\*(?!\*)|・)/.test(line.trim()));
  if (isList) {
    return (
      <ul className={className}>
        {lines.map((line) => (
          <li key={line}>{renderInline(line.replace(/^(\d+\.|-|\*(?!\*)|・)\s*/, ""))}</li>
        ))}
      </ul>
    );
  }

  return <p className={className}>{renderInline(trimmed.replace(/^[-*]\s+/gm, "・"))}</p>;
}
