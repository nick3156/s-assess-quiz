export type SubjectId = "member" | "roumu" | "keisu";

export type QuestionType = "single" | "trueFalse" | "case" | "fill";

export type ReviewStatus = "reviewed" | "partialScan" | "partialLawCheck" | "pendingScan";

export type TextbookSource = {
  id: SubjectId;
  title: string;
  shortTitle: string;
  reviewStatus: ReviewStatus;
  raw: string;
};

export type TextbookSection = {
  id: string;
  subjectId: SubjectId;
  title: string;
  chapterTitle: string;
  level: number;
  body: string;
  searchableText: string;
};

export type SourceRef = {
  subjectId: SubjectId;
  heading: string;
  quote: string;
};

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  subjectId: SubjectId;
  chapter: string;
  topic: string;
  importance: "high" | "normal";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceRef: SourceRef;
};

export type AnswerRecord = {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  answeredAt: string;
};
