import type { QuizQuestion } from "../types";

export const questions: QuizQuestion[] = [
  {
    id: "member-ojt-definition-001",
    type: "single",
    subjectId: "member",
    chapter: "第1章",
    topic: "OJT",
    importance: "high",
    prompt: "OJTの説明として最も適切なものはどれか。",
    options: [
      "職場外の講師が集合研修で知識を教える活動",
      "熟練者が非熟練者に対し、職務を通じて必要な能力開発を指導・支援する活動",
      "本人が自らテーマと目標を定めて自主的に学習する活動",
      "評価結果だけをもとにメンバーの処遇を決める活動",
    ],
    correctIndex: 1,
    explanation:
      "OJTは職場内で、熟練者が非熟練者に対して職務遂行上必要な能力開発要件を、職務を通じて指導・支援する活動。",
    sourceRef: {
      subjectId: "member",
      heading: "1. OJTとは何か?",
      quote:
        "OJTとは、職場組織内の熟練者が非熟練者に対して、職務遂行上必要な能力開発要件を、職務を通じて指導・支援していく活動。",
    },
  },
  {
    id: "member-training-methods-001",
    type: "single",
    subjectId: "member",
    chapter: "第1章",
    topic: "能力開発",
    importance: "high",
    prompt: "仕事に関係する教育手段の3分類として正しい組み合わせはどれか。",
    options: [
      "OJT・Off-JT・SD",
      "Plan・Do・See",
      "業績・執務態度・能力",
      "説明・示範・実習",
    ],
    correctIndex: 0,
    explanation:
      "メンバーの能力開発の教育手段は、OJT、Off-JT、SDの3つに整理される。",
    sourceRef: {
      subjectId: "member",
      heading: "1-2 能力開発の種類と構造",
      quote:
        "メンバーの能力開発の手段、すなわち仕事に関係する教育手段としては、OJT、Off-JT、SDの3つが挙げられる。",
    },
  },
  {
    id: "member-pds-001",
    type: "single",
    subjectId: "member",
    chapter: "第1章",
    topic: "PDS",
    importance: "high",
    prompt: "OJTを場当たり的にしないため、Plan過程で特に重要なことはどれか。",
    options: [
      "メンバーの行動を評価時まで観察しないこと",
      "マネジャーの印象だけで評価基準を決めること",
      "目標・方針、期待度、努力目標などを合意・納得できる形で確認すること",
      "Do過程だけで指導し、See過程では振り返らないこと",
    ],
    correctIndex: 2,
    explanation:
      "OJTはPlan過程から始まる。目標・方針や期待度、努力目標が合意されていないと、Do過程の指導が場当たり的になる。",
    sourceRef: {
      subjectId: "member",
      heading: "2-1 Plan-Do-Seeのサイクルを回す",
      quote:
        "マネジャーとメンバーが十分にコミュニケーションを行い、きちんと合意・納得できているかが大きなポイント。",
    },
  },
  {
    id: "member-evaluation-elements-001",
    type: "single",
    subjectId: "member",
    chapter: "第1章",
    topic: "評価",
    importance: "normal",
    prompt: "メンバーの仕事ぶりを評価する3大要素として正しいものはどれか。",
    options: [
      "能力・動機・性格",
      "業績・執務態度・能力",
      "目標・方針・期待度",
      "知識・技能・経験",
    ],
    correctIndex: 1,
    explanation:
      "評価の3大要素は、業績、執務態度、能力。評価基準はPlan過程で合意し、具体化しておく必要がある。",
    sourceRef: {
      subjectId: "member",
      heading: "3-1 評価基準のあり方",
      quote:
        "評価の3大要素は、業績、執務態度、能力。この3つの要素について具体的かつ詳細に目標を設定しておくことが必要。",
    },
  },
  {
    id: "member-praise-scold-001",
    type: "single",
    subjectId: "member",
    chapter: "第3章",
    topic: "ほめ方・叱り方",
    importance: "normal",
    prompt: "「叱る」と「怒る」の違いについて、教材の整理に近いものはどれか。",
    options: [
      "叱ることは感情の発散であり、怒ることは教育的な指摘である",
      "叱ることは問題点を指摘し改善を促す行為であり、怒ることは感情的な反応になりやすい",
      "叱ることも怒ることも、メンバーの自尊心を高めるために同じ意味で使う",
      "怒ることだけがマネジャーの指導技術として推奨される",
    ],
    correctIndex: 1,
    explanation:
      "叱る目的は、相手の成長や行動改善に向けて問題点を指摘すること。感情的な反応としての怒ることとは区別する。",
    sourceRef: {
      subjectId: "member",
      heading: "4. 「叱る」と「怒る」の違いは?",
      quote:
        "叱り方では、相手の自尊心や行動改善につながるよう、問題点を具体的に指摘することが重要。",
    },
  },
  {
    id: "member-trust-001",
    type: "single",
    subjectId: "member",
    chapter: "第4章",
    topic: "信頼関係",
    importance: "normal",
    prompt: "メンバーから信頼を得る仕事姿勢として、教材で重視されているものはどれか。",
    options: [
      "仕事熱心であること、利他的であること、責任をとること",
      "常に部下より長時間働くこと、指示を細かく出すこと、評価を厳しくすること",
      "社外ネットワークを持たず、部署内だけで完結させること",
      "迅速さよりも、手続きを増やして確認回数を多くすること",
    ],
    correctIndex: 0,
    explanation:
      "信頼感をもたれるための要件として、仕事熱心であること、利他的であること、責任をとることが挙げられている。",
    sourceRef: {
      subjectId: "member",
      heading: "3. 信頼を得る仕事に対する姿勢",
      quote:
        "信頼を得る仕事に対する姿勢として、仕事熱心であること、利他的であること、責任をとることが扱われる。",
    },
  },
  {
    id: "roumu-working-time-001",
    type: "single",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "労働時間",
    importance: "high",
    prompt: "労働時間の基本的な定義として正しいものはどれか。",
    options: [
      "拘束時間から休憩時間を差し引いた実労働時間",
      "出社してから退社するまでの全時間",
      "実際に手を動かして作業した時間だけ",
      "所定労働時間を超えた時間だけ",
    ],
    correctIndex: 0,
    explanation:
      "労働時間は、拘束時間から休憩時間を差し引いた実労働時間。使用者の指揮監督下にある時間が対象になる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1 労働時間はどこまでの範囲をさす？",
      quote:
        "労働時間とは、拘束時間から休憩時間を差し引いた実労働時間のこと。",
    },
  },
  {
    id: "roumu-standby-001",
    type: "case",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "手待ち時間",
    importance: "high",
    prompt: "休憩時間中でも電話や来客に備えて待機を命じられている場合、原則としてどう扱うか。",
    options: [
      "実際に電話対応がなければ休憩時間として扱う",
      "雑談や食事ができていれば労働時間ではない",
      "自由利用が保障されていないため労働時間とみなされる",
      "休憩時間かどうかは従業員の希望だけで決まる",
    ],
    correctIndex: 2,
    explanation:
      "待機を命じられ、自由に利用できない時間は使用者の指揮監督下にあるため、手待ち時間として労働時間になる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1-1 休憩時間と考えていても労働時間になる場合がある",
      quote:
        "休憩時間中でも、電話や不意の来客に備えて待機させている場合は、使用者の指揮監督下にある拘束時間とみなされる。",
    },
  },
  {
    id: "roumu-statutory-time-001",
    type: "single",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "法定労働時間",
    importance: "high",
    prompt: "法定労働時間の原則として正しいものはどれか。",
    options: [
      "1週35時間、1日7時間",
      "1週40時間、1日8時間",
      "1週45時間、1日9時間",
      "1週50時間、1日10時間",
    ],
    correctIndex: 1,
    explanation:
      "労働時間は原則として1週40時間、1日8時間が法定労働時間。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1 労働時間はどこまでの範囲をさす？",
      quote:
        "労働時間は原則として、1週40時間、1日8時間が法定労働時間として定められている。",
    },
  },
  {
    id: "roumu-training-after-hours-001",
    type: "case",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "研修と労働時間",
    importance: "normal",
    prompt: "業務時間外の研修が労働時間になる可能性が高いのはどのケースか。",
    options: [
      "希望者だけが任意で参加し、不参加による不利益がない",
      "出欠確認があり、欠席が人事評価上不利益に扱われる",
      "社外の自主セミナーを本人が自費で受講する",
      "会社が情報提供だけを行い、参加判断は完全に本人へ委ねる",
    ],
    correctIndex: 1,
    explanation:
      "業務命令や実質的な強制参加にあたる場合は、使用者の指揮監督下にあるものとして労働時間になる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "2-2 業務命令の有無と労働時間の判断",
      quote:
        "出欠確認が行われ、その結果が人事考課に反映される場合は、実質的に強制参加とみなされる。",
    },
  },
  {
    id: "roumu-flex-001",
    type: "single",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "フレックスタイム制",
    importance: "normal",
    prompt: "フレックスタイム制を導入している場合の労働時間管理について正しいものはどれか。",
    options: [
      "始業・終業が自由なので、会社は労働時間を把握しなくてよい",
      "深夜勤務や休日労働の確認も不要になる",
      "各日の出退勤時刻や労働時間を管理する必要がある",
      "清算期間内の過剰時間は必ず次期へ繰り越せる",
    ],
    correctIndex: 2,
    explanation:
      "フレックスタイム制でも、時間外・深夜・休日の確認が必要であり、各日の出退勤時間や労働時間を管理する必要がある。",
    sourceRef: {
      subjectId: "roumu",
      heading: "3-1 フレックスタイム制でも労働時間の管理は必要",
      quote:
        "フレックスタイム制を導入していても、各日の出退勤時間や労働時間の管理をきちんと行わなければならない。",
    },
  },
  {
    id: "roumu-paid-leave-001",
    type: "single",
    subjectId: "roumu",
    chapter: "第2章",
    topic: "年次有給休暇",
    importance: "high",
    prompt: "年次有給休暇の年5日取得義務について正しいものはどれか。",
    options: [
      "すべての労働者について、毎年5日を会社が指定する",
      "年10日以上付与される労働者について、年5日の取得が必要",
      "管理監督者には年次有給休暇が付与されない",
      "本人が請求しない限り、会社側の対応は不要",
    ],
    correctIndex: 1,
    explanation:
      "年10日以上の年次有給休暇が付与される労働者について、使用者は年5日を確実に取得させる必要がある。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1-4 年次有給休暇を年5日取得させなければならない",
      quote:
        "年10日以上の年次有給休暇が付与される労働者に対し、年5日について取得させる必要がある。",
    },
  },
];
