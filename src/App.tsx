import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactElement, TouchEvent } from "react";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Home,
  ListChecks,
  RotateCcw,
  Search,
  Settings,
  X,
} from "lucide-react";
import { questions } from "./data/questions";
import { textbooks } from "./data/textbooks";
import { loadProgress, saveProgress, summarizeProgress } from "./lib/progress";
import {
  markdownToBlocks,
  parseTextbook,
  resolveSourceSection,
  uniqueChapters,
} from "./lib/textbook";
import type { AnswerRecord, QuizQuestion, SubjectId, TextbookSection } from "./types";

type View = "home" | "quiz" | "book" | "progress";
type QuizMode = "daily" | "weak" | "subject";

const enabledSubjects: SubjectId[] = ["member", "roumu", "keisu"];

const subjectLabel: Record<SubjectId, string> = {
  member: "メンバー指導",
  roumu: "労務管理",
  keisu: "計数入門",
};

function todayQuestionSet() {
  return questions.slice(0, 5);
}

function nextQuestion(current: QuizQuestion, pool: QuizQuestion[]) {
  const index = pool.findIndex((question) => question.id === current.id);
  return pool[(index + 1) % pool.length];
}

function sourceStatusLabel(subjectId: SubjectId) {
  const status = textbooks.find((source) => source.id === subjectId)?.reviewStatus;
  if (status === "reviewed") return "校閲済み";
  if (status === "partialScan") return "スキャン照合中";
  if (status === "partialLawCheck") return "法改正・照合中";
  return "スキャン待ち";
}

function findLastWrongAnswer(answers: AnswerRecord[]) {
  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (!answers[index].isCorrect) return answers[index];
  }
  return undefined;
}

export function App() {
  const textbookSections = useMemo(
    () => textbooks.flatMap((source) => parseTextbook(source)),
    [],
  );
  const [view, setView] = useState<View>("home");
  const [quizMode, setQuizMode] = useState<QuizMode>("daily");
  const [activeSubject, setActiveSubject] = useState<SubjectId>("member");
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>();
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion>(() => {
    return questions.find((question) => question.id === progress.lastQuestionId) ?? questions[0];
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSourceQuote, setActiveSourceQuote] = useState("");

  const summary = summarizeProgress(progress.answers);
  const dailyQuestions = todayQuestionSet();
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
    const answered = new Set(
      progress.answers
        .filter((answer) =>
          subjectQuestions.some((question) => question.id === answer.questionId),
        )
        .map((answer) => answer.questionId),
    );
    return {
      subjectId,
      total: subjectQuestions.length,
      answered: answered.size,
      percent: subjectQuestions.length
        ? Math.round((answered.size / subjectQuestions.length) * 100)
        : 0,
    };
  });

  function recordAnswer(index: number) {
    setSelectedIndex(index);
    setShowExplanation(true);
    const answer: AnswerRecord = {
      questionId: activeQuestion.id,
      selectedIndex: index,
      isCorrect: index === activeQuestion.correctIndex,
      answeredAt: new Date().toISOString(),
    };
    const nextProgress = {
      answers: [...progress.answers, answer],
      lastQuestionId: activeQuestion.id,
    };
    setProgress(nextProgress);
    saveProgress(nextProgress);
  }

  function goToQuestion(question: QuizQuestion) {
    setActiveQuestion(question);
    setSelectedIndex(null);
    setShowExplanation(false);
    const nextProgress = { ...progress, lastQuestionId: question.id };
    setProgress(nextProgress);
    saveProgress(nextProgress);
    setView("quiz");
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
            onStart={() => goToQuestion(dailyQuestions[0])}
            onReview={() => {
              const wrong = findLastWrongAnswer(progress.answers);
              const target =
                questions.find((question) => question.id === wrong?.questionId) ??
                dailyQuestions[0];
              goToQuestion(target);
            }}
          />
        )}

        {view === "quiz" && (
          <QuizView
            question={activeQuestion}
            mode={quizMode}
            selectedIndex={selectedIndex}
            showExplanation={showExplanation}
            latestAnswer={latestAnswer}
            onModeChange={setQuizMode}
            onAnswer={recordAnswer}
            onNext={() => goToQuestion(nextQuestion(activeQuestion, questions))}
            onOpenBook={() => openSource(activeQuestion)}
            onBackHome={() => setView("home")}
          />
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
            onMoveSection={(section) => {
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
              const nextProgress = { answers: [] };
              setProgress(nextProgress);
              saveProgress(nextProgress);
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
  onStart,
  onReview,
}: {
  summary: ReturnType<typeof summarizeProgress>;
  subjectStats: { subjectId: SubjectId; total: number; answered: number; percent: number }[];
  onStart: () => void;
  onReview: () => void;
}) {
  return (
    <section className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">2027 再受験対策</p>
          <h1>今日の学習</h1>
        </div>
        <button className="icon-button" aria-label="設定">
          <Settings />
        </button>
      </header>

      <section className="hero-panel">
        <div>
          <p className="panel-label">今日追加された問題</p>
          <p className="hero-number">
            5 <span>問</span>
          </p>
        </div>
        <div className="ring" style={{ "--value": `${summary.accuracy}%` } as CSSProperties}>
          <span>{summary.accuracy}%</span>
        </div>
        <div className="button-row">
          <button className="primary-action" onClick={onStart}>
            今日の5問を解く
          </button>
          <button className="secondary-action" onClick={onReview}>
            復習
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="学習状況">
        <Metric label="回答済み" value={`${summary.answeredCount}`} />
        <Metric label="正答率" value={`${summary.accuracy}%`} />
        <Metric label="復習待ち" value={`${summary.wrongCount}`} />
      </section>

      <section className="card">
        <div className="section-head">
          <h2>科目別</h2>
          <span className="badge blue">計数も校閲中</span>
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
              <span className="badge neutral">{sourceStatusLabel(stat.subjectId)}</span>
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
  mode,
  selectedIndex,
  showExplanation,
  latestAnswer,
  onModeChange,
  onAnswer,
  onNext,
  onOpenBook,
  onBackHome,
}: {
  question: QuizQuestion;
  mode: QuizMode;
  selectedIndex: number | null;
  showExplanation: boolean;
  latestAnswer?: AnswerRecord;
  onModeChange: (mode: QuizMode) => void;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onOpenBook: () => void;
  onBackHome: () => void;
}) {
  return (
    <section className="screen">
      <header className="topbar">
        <button className="icon-button" aria-label="戻る" onClick={onBackHome}>
          <ChevronLeft />
        </button>
        <div className="topbar-center">
          <p className="eyebrow">{question.chapter}</p>
          <h1>問題を解く</h1>
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
          弱点
        </button>
        <button
          className={mode === "subject" ? "active" : ""}
          onClick={() => onModeChange("subject")}
        >
          分野
        </button>
      </div>

      <article className="question-card">
        <div className="question-meta">
          <span>{subjectLabel[question.subjectId]} / {question.topic}</span>
          <span className={`badge ${question.importance === "high" ? "warn" : "neutral"}`}>
            {question.importance === "high" ? "重要" : "標準"}
          </span>
        </div>
        <p className="question-text">{question.prompt}</p>
        <div className="source-tags">
          <span className="chip">{question.type === "case" ? "ケース" : "4択"}</span>
          <span className="chip">出典あり</span>
          <span className="chip">{sourceStatusLabel(question.subjectId)}</span>
        </div>
      </article>

      <div className="answer-list">
        {question.options.map((option, index) => {
          const status =
            showExplanation && index === question.correctIndex
              ? "correct"
              : showExplanation && index === selectedIndex
                ? "wrong"
                : selectedIndex === index
                  ? "selected"
                  : "";
          return (
            <button
              className={`answer ${status}`}
              key={option}
              onClick={() => !showExplanation && onAnswer(index)}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{option}</strong>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <section className="card explanation">
          <div className="result-line">
            <div className={latestAnswer?.isCorrect ? "result-mark ok" : "result-mark ng"}>
              {latestAnswer?.isCorrect ? <Check /> : <X />}
            </div>
            <div>
              <p className="eyebrow">解説</p>
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
    </section>
  );
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
  onMoveSection,
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
  onMoveSection: (section: TextbookSection) => void;
  onBackToQuestion: () => void;
}) {
  const [tocOpen, setTocOpen] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [visibleSectionId, setVisibleSectionId] = useState(activeSection.id);
  const edgeRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const scrubTargetsRef = useRef<{ id: string; y: number }[]>([]);
  const activeScrubIndexRef = useRef(-1);
  const isScrubbingRef = useRef(false);
  const chapters = uniqueChapters(sections);
  const visibleSection = sections.find((section) => section.id === visibleSectionId) ?? activeSection;
  const activeChapter = visibleSection.chapterTitle;
  const navSections = query ? filteredSections : sections;
  const activeChapterIndex = chapters.findIndex((chapter) => chapter === activeChapter);
  const progress = chapters.length
    ? Math.round(((activeChapterIndex + 1) / chapters.length) * 100)
    : 0;

  function moveToChapter(chapter: string) {
    const firstSection = sections.find((section) => section.chapterTitle === chapter);
    if (firstSection) moveToSection(firstSection);
  }

  function moveToSection(section: TextbookSection, behavior: ScrollBehavior = "smooth") {
    onMoveSection(section);
    setVisibleSectionId(section.id);
    window.requestAnimationFrame(() => {
      document.getElementById(section.id)?.scrollIntoView({
        block: "start",
        behavior,
      });
    });
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

  const openToc = () => {
    window.clearTimeout(closeTimerRef.current);
    setTocOpen(true);
  };

  const closeTocSoon = () => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setTocOpen(false), 420);
  };

  const buildScrubTargets = () => {
    const topbar = document.querySelector(".reader-topbar");
    const offset = (topbar?.getBoundingClientRect().height ?? 0) + 18;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrubTargetsRef.current = sections.map((section) => {
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

  const syncPanelToActiveItem = (targetIndex: number) => {
    const panel = document.querySelector(".reader-scrub-panel");
    const activeItem = document.querySelector<HTMLElement>(
      `.reader-scrub-item[data-target="${scrubTargetsRef.current[targetIndex]?.id}"]`,
    );
    if (!panel || !activeItem) return;
    const itemRect = activeItem.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    if (itemRect.top < panelRect.top + 18 || itemRect.bottom > panelRect.bottom - 18) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  };

  const scrubToPointer = (clientY: number) => {
    const edge = edgeRef.current;
    const targets = scrubTargetsRef.current;
    if (!edge || !targets.length) return;
    const rect = edge.getBoundingClientRect();
    const progressRatio = Math.min(Math.max((clientY - rect.top) / Math.max(1, rect.height), 0), 1);
    const scaled = progressRatio * (targets.length - 1);
    const lowerIndex = Math.floor(scaled);
    const upperIndex = Math.min(targets.length - 1, lowerIndex + 1);
    const localProgress = scaled - lowerIndex;
    const lower = targets[lowerIndex];
    const upper = targets[upperIndex];
    const targetY = lower.y + (upper.y - lower.y) * localProgress;
    const activeIndex = Math.round(scaled);

    edge.style.setProperty(
      "--scrub-y",
      `${Math.min(Math.max(clientY - rect.top, 0), rect.height)}px`,
    );
    window.scrollTo({ top: targetY, behavior: "auto" });

    if (activeScrubIndexRef.current !== activeIndex) {
      activeScrubIndexRef.current = activeIndex;
      setVisibleSectionId(targets[activeIndex].id);
      syncPanelToActiveItem(activeIndex);
    }
  };

  const startScrub = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    buildScrubTargets();
    activeScrubIndexRef.current = -1;
    isScrubbingRef.current = true;
    setIsScrubbing(true);
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
    isScrubbingRef.current = false;
    setIsScrubbing(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    closeTocSoon();
    event.preventDefault();
  };

  const startTouchScrub = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    buildScrubTargets();
    activeScrubIndexRef.current = -1;
    isScrubbingRef.current = true;
    setIsScrubbing(true);
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
    isScrubbingRef.current = false;
    setIsScrubbing(false);
    closeTocSoon();
    event.preventDefault();
  };

  return (
    <section className="screen book-screen">
      <header className="topbar reader-topbar">
        <div>
          <p className="eyebrow">{subjectLabel[activeSubject]}</p>
          <h1>電子教科書</h1>
        </div>
        <button className="icon-button" aria-label="問題の解説へ戻る" onClick={onBackToQuestion}>
          <ChevronLeft />
        </button>
      </header>

      <div className="book-subject-tabs reader-subject-tabs" aria-label="教科書科目">
        {enabledSubjects.map((subjectId) => (
          <button
            className={activeSubject === subjectId ? "active" : ""}
            key={subjectId}
            onClick={() => onSubjectChange(subjectId)}
          >
            {textbooks.find((book) => book.id === subjectId)?.shortTitle}
          </button>
        ))}
      </div>

      <nav className="reader-chapter-strip" aria-label="章ジャンプ">
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

      <label className="reader-search">
        <Search />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="教科書内を検索"
        />
      </label>

      {activeSourceQuote && (
        <button className="source-jump" onClick={() => moveToSection(activeSection)}>
          <BookMarked />
          <span>問題の出典箇所を表示中</span>
          <ChevronRight />
        </button>
      )}

      <button
        className={`reader-toc-backdrop${tocOpen ? " is-open" : ""}`}
        aria-label="目次を閉じる"
        onClick={() => setTocOpen(false)}
      />

      <section className="reader-layout chapter-reader-layout">
        <article className="reader-card reader-scroll-page">
          <div className="reader-meta">
            <span>{activeChapter}</span>
            <span>{sourceStatusLabel(visibleSection.subjectId)}</span>
            <span>{progress}%</span>
          </div>
          <h2>{activeChapter}</h2>
          <div className="reader-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="reader-body">
            {sections.map((section) => (
              <section
                className={`reader-section${section.id === visibleSectionId ? " is-current" : ""}`}
                id={section.id}
                key={section.id}
              >
                <h3>{section.title}</h3>
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
            ))}
          </div>
        </article>
      </section>

      <aside
        ref={edgeRef}
        className={`reader-scrub-index${tocOpen ? " is-open" : ""}${isScrubbing ? " is-scrubbing" : ""}`}
        aria-label="右端目次"
        onPointerEnter={openToc}
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
        <div className="reader-scrub-handle" aria-hidden="true" />
        <div className="reader-scrub-tracker" aria-hidden="true" />
        <nav className="reader-scrub-panel" aria-label="目次">
          <div className="reader-scrub-title">
            <span>{query ? "検索結果" : subjectLabel[activeSubject]}</span>
            <strong>{navSections.length}</strong>
          </div>
          {navSections.map((section) => (
            <button
              className={`reader-scrub-item${section.id === visibleSectionId ? " active" : ""}`}
              data-target={section.id}
              key={section.id}
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              <span>{section.title}</span>
              <small>{section.chapterTitle}</small>
            </button>
          ))}
        </nav>
      </aside>
    </section>
  );
}

function ProgressView({
  summary,
  subjectStats,
  onReset,
}: {
  summary: ReturnType<typeof summarizeProgress>;
  subjectStats: { subjectId: SubjectId; total: number; answered: number; percent: number }[];
  onReset: () => void;
}) {
  return (
    <section className="screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">学習記録</p>
          <h1>進捗</h1>
        </div>
        <button className="icon-button" aria-label="リセット" onClick={onReset}>
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
          <h2>実装状態</h2>
          <span className="badge warn">限定公開前提</span>
        </div>
        <div className="notice-list">
          <p>
            <CircleAlert />
            教科書本文を内蔵するため、公開時はアクセス制限を前提にする。
          </p>
          <p>
            <CircleAlert />
            計数入門はスキャン原本から教科書化を進行中。問題化は照合済みチャンクから始める。
          </p>
        </div>
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

function MarkdownBlock({ block, highlight }: { block: string; highlight: boolean }) {
  const cleaned = block
    .replace(/\*\*/g, "")
    .replace(/^>\s?/gm, "")
    .replace(/\n/g, "\n");
  const trimmed = cleaned.trim();

  const tableLines = trimmed.split("\n").filter((line) => line.trim().startsWith("|"));
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
      <div className={`reader-table-wrap${highlight ? " highlight" : ""}`}>
        <table className="reader-table">
          <thead>
            <tr>
              {head.map((cell) => (
                <th key={cell}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (/^```/.test(trimmed)) {
    return (
      <pre className={highlight ? "highlight" : ""}>
        {trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim()}
      </pre>
    );
  }

  if (/^【?POINT】?$/.test(trimmed)) {
    return <div className="reader-label point-label">POINT</div>;
  }
  if (/^\[注釈\]$/.test(trimmed)) {
    return <div className="reader-label note-label">注釈</div>;
  }

  const className = [
    /^【?Case\s*\d+/i.test(trimmed) || trimmed.includes("Case ") ? "case-block" : "",
    trimmed.includes("図表") ? "figure-block" : "",
    trimmed.includes("用語解説") || trimmed.includes("[注釈]") ? "note-block" : "",
    highlight ? "highlight" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (trimmed.includes("|") || trimmed.includes("→")) {
    return <pre className={className}>{trimmed}</pre>;
  }

  const lines = trimmed.split("\n").filter(Boolean);
  const isList = lines.length > 1 && lines.every((line) => /^(\d+\.|[-*]|・)/.test(line.trim()));
  if (isList) {
    return (
      <ul className={className}>
        {lines.map((line) => (
          <li key={line}>{line.replace(/^(\d+\.|[-*]|・)\s*/, "")}</li>
        ))}
      </ul>
    );
  }

  return <p className={className}>{trimmed.replace(/^[-*]\s+/gm, "・")}</p>;
}
