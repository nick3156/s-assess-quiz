import type { QuizQuestion } from "../types";
import { memberAdditions } from "./questions-member-add";
import { roumuAdditions } from "./questions-roumu-add";
import { keisuAdditions } from "./questions-keisu-add";
import { memberC1Additions } from "./questions-member-c1-add";
import { memberC2Additions } from "./questions-member-c2-add";
import { memberC34Additions } from "./questions-member-c34-add";
import { roumuC1Additions } from "./questions-roumu-c1-add";
import { roumuC23Additions } from "./questions-roumu-c23-add";
import { roumuC456Additions } from "./questions-roumu-c456-add";
import { keisuC01Additions } from "./questions-keisu-c01-add";
import { keisuC2Additions } from "./questions-keisu-c2-add";
import { keisuC34Additions } from "./questions-keisu-c34-add";

const baseQuestions: QuizQuestion[] = [
  {
    id: "member-ojt-definition-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "OJT",
    importance: "high",
    prompt: "OJTの説明として正しいものをすべて選べ。",
    options: [
      "職場外の講師が集合研修で知識を教える活動",
      "熟練者が非熟練者に対し、職務を通じて必要な能力開発を指導・支援する活動",
      "本人が自らテーマと目標を定めて自主的に学習する活動",
      "評価結果だけをもとにメンバーの処遇を決める活動",
    ],
    correctIndexes: [1],
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
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "能力開発",
    importance: "high",
    prompt: "仕事に関係する教育手段の3分類として正しい組み合わせをすべて選べ。",
    options: [
      "OJT・Off-JT・SD",
      "Plan・Do・See",
      "業績・執務態度・能力",
      "説明・示範・実習",
    ],
    correctIndexes: [0],
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
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "PDS",
    importance: "high",
    prompt: "OJTを場当たり的にしないため、Plan過程で重要なこととして正しいものをすべて選べ。",
    options: [
      "メンバーの行動を評価時まで観察しないこと",
      "マネジャーの印象だけで評価基準を決めること",
      "目標・方針、期待度、努力目標などを合意・納得できる形で確認すること",
      "Do過程だけで指導し、See過程では振り返らないこと",
    ],
    correctIndexes: [2],
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
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "評価",
    importance: "normal",
    prompt: "メンバーの仕事ぶりを評価する3大要素として正しいものをすべて選べ。",
    options: [
      "能力・動機・性格",
      "業績・執務態度・能力",
      "目標・方針・期待度",
      "知識・技能・経験",
    ],
    correctIndexes: [1],
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
    type: "trueFalse",
    subjectId: "member",
    chapter: "第3章",
    topic: "ほめ方・叱り方",
    importance: "normal",
    prompt: "「叱る」と「怒る」の違いについて、教材の整理に近いものをすべて選べ。",
    options: [
      "叱ることは感情の発散であり、怒ることは教育的な指摘である",
      "叱ることは問題点を指摘し改善を促す行為であり、怒ることは感情的な反応になりやすい",
      "叱ることも怒ることも、メンバーの自尊心を高めるために同じ意味で使う",
      "怒ることだけがマネジャーの指導技術として推奨される",
    ],
    correctIndexes: [1],
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
    type: "trueFalse",
    subjectId: "member",
    chapter: "第4章",
    topic: "信頼関係",
    importance: "normal",
    prompt: "メンバーから信頼を得る仕事姿勢として、教材で重視されているものをすべて選べ。",
    options: [
      "仕事熱心であること、利他的であること、責任をとること",
      "常に部下より長時間働くこと、指示を細かく出すこと、評価を厳しくすること",
      "社外ネットワークを持たず、部署内だけで完結させること",
      "迅速さよりも、手続きを増やして確認回数を多くすること",
    ],
    correctIndexes: [0],
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
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "労働時間",
    importance: "high",
    prompt: "労働時間の基本的な定義として正しいものをすべて選べ。",
    options: [
      "拘束時間から休憩時間を差し引いた実労働時間",
      "出社してから退社するまでの全時間",
      "実際に手を動かして作業した時間だけ",
      "所定労働時間を超えた時間だけ",
    ],
    correctIndexes: [0],
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
    correctIndexes: [2],
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
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "法定労働時間",
    importance: "high",
    prompt: "法定労働時間の原則として正しいものをすべて選べ。",
    options: [
      "1週35時間、1日7時間",
      "1週40時間、1日8時間",
      "1週45時間、1日9時間",
      "1週50時間、1日10時間",
    ],
    correctIndexes: [1],
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
    prompt: "業務時間外の研修が労働時間になる可能性について、正しいものをすべて選べ。",
    options: [
      "希望者だけが任意で参加し、不参加による不利益がない",
      "出欠確認があり、欠席が人事評価上不利益に扱われる",
      "社外の自主セミナーを本人が自費で受講する",
      "会社が情報提供だけを行い、参加判断は完全に本人へ委ねる",
    ],
    correctIndexes: [1],
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
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "フレックスタイム制",
    importance: "normal",
    prompt: "フレックスタイム制を導入している場合の労働時間管理について正しいものをすべて選べ。",
    options: [
      "始業・終業が自由なので、会社は労働時間を把握しなくてよい",
      "深夜勤務や休日労働の確認も不要になる",
      "各日の出退勤時刻や労働時間を管理する必要がある",
      "清算期間内の過剰時間は必ず次期へ繰り越せる",
    ],
    correctIndexes: [2],
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
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第2章",
    topic: "年次有給休暇",
    importance: "high",
    prompt: "年次有給休暇の年5日取得義務について正しいものをすべて選べ。",
    options: [
      "すべての労働者について、毎年5日を会社が指定する",
      "年10日以上付与される労働者について、年5日の取得が必要",
      "管理監督者には年次有給休暇が付与されない",
      "本人が請求しない限り、会社側の対応は不要",
    ],
    correctIndexes: [1],
    explanation:
      "年10日以上の年次有給休暇が付与される労働者について、使用者は年5日を確実に取得させる必要がある。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1-4 年次有給休暇を年5日取得させなければならない",
      quote:
        "年10日以上の年次有給休暇が付与される労働者に対し、年5日について取得させる必要がある。",
    },
  },
  {
    id: "member-ojt-methods-002",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "OJT",
    importance: "normal",
    prompt: "OJTの機会と方法を選ぶ際に重視すべきこととして正しいものをすべて選べ。",
    options: [
      "全員に同じ研修を同じ順序で受けさせること",
      "メンバーに合った適切な方法を、仕事ぶりの観察と能力要件の分析にもとづいて選ぶこと",
      "Off-JTとSDを使わず、示範だけに限定すること",
      "本人の希望だけでOJTの内容を決めること",
    ],
    correctIndexes: [1],
    explanation:
      "OJTの方法は固定ではない。仕事に必要な知識・技能・態度を分析し、メンバーの仕事ぶりを観察したうえで、誰に何をどう用いるかを判断する。",
    sourceRef: {
      subjectId: "member",
      heading: "2-2 OJTの機会と方法",
      quote:
        "仕事に必要な知識・技能・態度をよく分析し、メンバーの仕事ぶりをよく観察して、誰に、何を、どのように用いるかを判断してください。",
    },
  },
  {
    id: "member-work-inventory-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "仕事の棚卸し",
    importance: "high",
    prompt: "日常業務の見直しがOJT実践の第一歩とされる理由として正しいものをすべて選べ。",
    options: [
      "仕事の棚卸しによって、育成必要点や自己啓発目標が明確になるため",
      "仕事の見直しをすれば、評価面談を省略できるため",
      "業務の割当てを固定し、環境変化に対応しないため",
      "OJTをOff-JTに置き換えるため",
    ],
    correctIndexes: [0],
    explanation:
      "仕事の棚卸しは、誰に仕事が割り当てられているか、仕事に必要な知識・技能・態度は何かを明らかにする。これがマネジャーにとっての育成必要点、メンバーにとっての自己啓発目標になる。",
    sourceRef: {
      subjectId: "member",
      heading: "4-2 日常業務の見直しがOJT実践の第一歩",
      quote:
        "OJTの第一歩は、メンバー一人ひとりが分担している仕事を的確に把握することです。",
    },
  },
  {
    id: "member-teaching-process-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "教え方",
    importance: "high",
    prompt: "教え方の基本プロセスとして正しい順序をすべて選べ。",
    options: [
      "説明 → 示範 → 実習 → フィードバック",
      "実習 → 説明 → 評価 → 放任",
      "叱責 → 示範 → 目標変更 → 実習",
      "会議参加 → Off-JT → SD → 評価",
    ],
    correctIndexes: [0],
    explanation:
      "教材では、教え方の基本プロセスを、言ってみる（説明）、やってみせる（示範）、させてみる（実習）、ほめてやる（フィードバック）として整理している。",
    sourceRef: {
      subjectId: "member",
      heading: "6-3 教え方の基本プロセス",
      quote:
        "言ってみる: 説明、やってみせる: 示範、させてみる: 実習、ほめてやる: フィードバック。",
    },
  },
  {
    id: "member-coaching-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第1章",
    topic: "コーチング",
    importance: "normal",
    prompt: "コーチングの手順として、メンバー自身に求めることをすべて選べ。",
    options: [
      "マネジャーの解答をそのまま受け入れさせること",
      "自分で実施計画を立て、選択した行動を実行してもらうこと",
      "問題点を曖昧にしたまま励ますこと",
      "行動後のフィードバックを省略すること",
    ],
    correctIndexes: [1],
    explanation:
      "コーチングでは、現状確認、率直な意見共有、ギャップの明確化を経て、メンバー自身が具体的にどうしたいかを選択し、実行する。その後のフィードバックも必要。",
    sourceRef: {
      subjectId: "member",
      heading: "7-2 コーチングのポイントと手順",
      quote:
        "メンバー自身で実施の計画を立てる。メンバーに実行してもらう。行動のフィードバックを適切に行う。",
    },
  },
  {
    id: "member-motivation-drive-incentive-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第2章",
    topic: "動機づけ",
    importance: "high",
    prompt: "教材における「動因」と「誘因」の説明として正しいものをすべて選べ。",
    options: [
      "動因は集団の目標、誘因は本人の欲求である",
      "動因は本人の欲求、誘因は仕事をベースに欲求を引き出す集団の目標である",
      "動因も誘因も、評価制度の名称である",
      "動因と誘因は一致しないほど動機づけが強くなる",
    ],
    correctIndexes: [1],
    explanation:
      "動因は本人の欲求、誘因は仕事をベースにした集団の目標として整理される。動因と誘因が一致したとき、メンバーは動機づけられる。",
    sourceRef: {
      subjectId: "member",
      heading: "2-1 「動因」と「誘因」の一致を図る",
      quote:
        "動因と誘因が一致したとき、メンバーは動機づけられ、やる気を起こします。",
    },
  },
  {
    id: "member-counseling-skills-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第2章",
    topic: "カウンセリング",
    importance: "normal",
    prompt: "カウンセリング・スキルのうち、相手の態度や話を丸ごと受け止める能力をすべて選べ。",
    options: ["受容", "自己一致", "フィードバック", "示範"],
    correctIndexes: [0],
    explanation:
      "受容は、上下関係や立場の違いを越え、批判や説教をせずに相手を受け止める能力。これにより相手はカタルシス効果を得やすくなる。",
    sourceRef: {
      subjectId: "member",
      heading: "4-2 カウンセリング・スキルを身につける",
      quote:
        "受容: 相手の態度や話を丸ごと受け止める能力です。",
    },
  },
  {
    id: "member-praise-awareness-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第3章",
    topic: "ほめ方",
    importance: "normal",
    prompt: "ほめることの心理的効果として、教材が重視しているものをすべて選べ。",
    options: [
      "マネジャーの指示を一方的に通しやすくすること",
      "メンバーに自ら変わろうとする気づきの機会を提供すること",
      "失敗の原因を本人に押しつけること",
      "評価基準を曖昧にすること",
    ],
    correctIndexes: [1],
    explanation:
      "ほめることは、本人が自ら変わろうとする気づきの機会をつくる。マネジャーが先回りして全部指導すると、その気づきを損なう場合がある。",
    sourceRef: {
      subjectId: "member",
      heading: "2-1 “気づき”を促す",
      quote:
        "ほめられることによって、自ら変わろうと動機づけるきっかけを作る、その“気づき”の機会を提供することにあります。",
    },
  },
  {
    id: "member-questioning-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第3章",
    topic: "質問",
    importance: "normal",
    prompt: "仕事に関する質問の基本として正しいものをすべて選べ。",
    options: [
      "1回の質問に複数の論点を詰め込む",
      "プライバシーも含めて知りたいことはすべて質問する",
      "相手が話しやすいように問いかけを工夫し、1回に1つの内容を聞く",
      "否定的な質問を基本にして相手の反応を見る",
    ],
    correctIndexes: [2],
    explanation:
      "質問は相手に話させること。仕事に必要な範囲で、相手が話しやすいように問いかけ、1回の質問では1つの内容に絞る。",
    sourceRef: {
      subjectId: "member",
      heading: "7-2 質問のしかた",
      quote:
        "質問は「相手に話させる」ことですから、相手が話しやすいように問いかけを工夫することが重要です。",
    },
  },
  {
    id: "roumu-rest-break-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "休憩時間",
    importance: "high",
    prompt: "労働時間が8時間を超える場合に必要な休憩時間として正しいものをすべて選べ。",
    options: ["30分以上", "45分以上", "1時間以上", "2時間以上"],
    correctIndexes: [2],
    explanation:
      "休憩時間は、6時間以下なら不要、6時間を超え8時間以下なら45分以上、8時間を超える場合は1時間以上を労働時間の途中に与える必要がある。",
    sourceRef: {
      subjectId: "roumu",
      heading: "7 休憩を与えるうえでの留意点は？",
      quote:
        "6時間を超え8時間以下の場合は45分以上、8時間を超える場合は1時間以上の休憩時間を、労働時間の途中に与えなければなりません。",
    },
  },
  {
    id: "roumu-teaki-temachi-001",
    type: "case",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "手あき時間",
    importance: "normal",
    prompt: "訪問先の都合で2時間待つことになり、その間は喫茶店や本屋で自由に過ごせた。この時間の扱いとして正しいものをすべて選べ。",
    options: [
      "使用者の指揮監督下にあるため必ず労働時間",
      "自由に利用できる手あき時間であり、休憩時間とみなしてよい",
      "移動中ではないため賃金計算から必ず除外できない",
      "待機していた場所が社外なので休日労働になる",
    ],
    correctIndexes: [1],
    explanation:
      "仕事のために待機している手待ち時間は労働時間だが、仕事から離れてまったく自由に利用できる時間は手あき時間であり、休憩時間とみなせる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "8 「手あき時間」と「手待ち時間」の違いは？",
      quote:
        "従業員が仕事から離れ、まったく自由に利用できる時間であれば手あき時間となり、休憩時間とみなしてよいとされています。",
    },
  },
  {
    id: "roumu-overtime-composition-001",
    type: "case",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "残業",
    importance: "high",
    prompt: "所定労働時間が7時間の日に終業後2時間残業した場合の扱いとして、正しいものをすべて選べ。",
    options: ["2時間すべて", "1時間", "30分", "0時間"],
    correctIndexes: [1],
    explanation:
      "1日8時間の法定労働時間までは法定内残業として通常賃金の対象。所定7時間の日に2時間残業した場合、1時間は法定内、残り1時間が法定外で割増賃金の対象になる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "11 残業や休日出勤の取扱いで気をつける点は？",
      quote:
        "2時間の残業のうち、1時間は法定内の労働時間として1時間分の通常の賃金を支給すれば割増賃金は必要ありません。残りの1時間は、法定外の労働時間として割増賃金を支給しなければならないことになります。",
    },
  },
  {
    id: "roumu-substitute-holiday-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "代休",
    importance: "high",
    prompt: "代休と休日振替の違いとして正しいものをすべて選べ。",
    options: [
      "代休は事前に休日と労働日を入れ替える制度である",
      "休日振替は事後に休みを与える制度であり、休日労働の事実は残る",
      "代休を与えても休日出勤をした事実は変わらず、法定休日労働なら割増賃金が必要になる",
      "代休を与えれば、休日労働の割増賃金は常に不要になる",
    ],
    correctIndexes: [2],
    explanation:
      "代休は休日労働後に別日で休ませる扱いで、休日労働の事実は消えない。事前の休日振替とは異なる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "12 代休を与えた場合に注意する点は？",
      quote:
        "休日出勤を行った後に代休を与えても、休日出勤を行った事実に変わりはありません。",
    },
  },
  {
    id: "roumu-paid-leave-season-change-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第2章",
    topic: "年次有給休暇",
    importance: "high",
    prompt: "年次有給休暇の時季変更権について正しいものをすべて選べ。",
    options: [
      "会社が忙しいと感じれば自由に行使できる",
      "事業の正常な運営を妨げる明確な理由がある場合に限って行使できる",
      "就業規則の届出期限を過ぎた申請には必ず行使できる",
      "退職日以降へ変更できるため、退職前の一括請求は拒否できる",
    ],
    correctIndexes: [1],
    explanation:
      "時季変更権は例外的な権利で、事業の正常な運営を妨げる場合に限られる。代替要員確保の努力もなく行使すれば濫用になり得る。",
    sourceRef: {
      subjectId: "roumu",
      heading: "2 年次有給休暇の時季変更権はどんなときに使える？",
      quote:
        "時季変更権は、「事業の正常な運営を妨げる」場合に該当するときに限って行使できるものです。",
    },
  },
  {
    id: "roumu-planned-paid-leave-001",
    type: "case",
    subjectId: "roumu",
    chapter: "第2章",
    topic: "計画的付与",
    importance: "normal",
    prompt: "会社一斉の計画的付与日に、年休がまだ発生していない新入社員を休ませる場合の扱いとして正しいものをすべて選べ。",
    options: [
      "ノーワーク・ノーペイで無給にしてよい",
      "使用者の責に帰すべき休業となり、休業手当の支払いが必要になる",
      "新入社員だけ出勤させれば必ず適法になる",
      "本人の同意があれば休業手当は不要になる",
    ],
    correctIndexes: [1],
    explanation:
      "会社一斉の計画的付与で、年休がない従業員を休ませる場合は使用者の責に帰すべき休業となり、平均賃金の60%以上の休業手当が必要になる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "3 取得要件に満たない新入社員はどう扱えばよいか？",
      quote:
        "使用者の責に帰すべき休業となり、当日は休業手当（平均賃金の100分の60以上）を支払う必要があります。",
    },
  },
  {
    id: "roumu-premium-rate-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "割増賃金",
    importance: "high",
    prompt: "休日労働の割増率として正しいものをすべて選べ。",
    options: ["25%以上", "35%以上", "50%以上", "75%以上"],
    correctIndexes: [1],
    explanation:
      "法定休日労働の割増率は35%以上。時間外労働は25%以上、月60時間超の時間外労働は50%以上、深夜労働は25%以上と整理される。",
    sourceRef: {
      subjectId: "roumu",
      heading: "12 代休を与えた場合に注意する点は？",
      quote:
        "休日労働|35%以上",
    },
  },
  {
    id: "roumu-rest-free-use-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "休憩時間",
    importance: "normal",
    prompt: "休憩時間の自由利用について正しいものをすべて選べ。",
    options: [
      "休憩時間は常に上司の許可がなければ外出できないようにすべきである",
      "休憩時間は自由利用が保障されるが、職場秩序保持上必要な制限は休憩目的を妨げない範囲であり得る",
      "休憩時間中のすべての行動を使用者が自由に命令できる",
      "休憩時間は労働時間の最後にまとめて与えるのが原則である",
    ],
    correctIndexes: [1],
    explanation:
      "休憩時間は労働から離れることを保障された時間で、自由利用が原則。ただし職場秩序保持上必要な制限は、休憩の目的を妨げない範囲で認められる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "7 休憩を与えるうえでの留意点は？",
      quote:
        "休憩時間は、従業員が自由に利用できることが保障されています。",
    },
  },
  {
    id: "keisu-numbers-importance-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "序章",
    topic: "計数感覚",
    importance: "normal",
    prompt: "ビジネスで数字を使う意義として正しいものをすべて選べ。",
    options: [
      "主観的な印象だけで状況を説明できるようにするため",
      "状況を客観的に把握し、相手に的確に伝えるため",
      "計算そのものを目的化するため",
      "売上や利益の話を避けるため",
    ],
    correctIndexes: [1],
    explanation:
      "数字を使うことで、売上がどの程度伸びているか、仕事がどの程度遅れているかを客観的に説明できる。計数感覚は状況把握と意思決定の土台になる。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 ビジネスにおける「数字」の重要性",
      quote:
        "具体的な数字を含んだ表現にしてみましょう。「売上高は前年比で3%アップです」、「予定より少し遅れていますが、あと3日で完成します」といえば、だれでも客観的に状況を把握できます。",
    },
  },
  {
    id: "keisu-profit-rate-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第1章",
    topic: "利益意識",
    importance: "high",
    prompt: "売上高100円、費用90円の場合の利益率として正しいものをすべて選べ。",
    options: ["5%", "10%", "90%", "110%"],
    correctIndexes: [1],
    explanation:
      "利益は売上高100円から費用90円を差し引いた10円。利益率は利益10円÷売上高100円×100で10%。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 100円売るといくらもうかる?",
      quote:
        "利益を意識するには、売上高から費用を差し引いた利益と、売上高に対する利益の割合を把握することが大切。",
    },
  },
  {
    id: "keisu-cost-awareness-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第1章",
    topic: "コスト意識",
    importance: "normal",
    prompt: "コスト意識として正しい考え方をすべて選べ。",
    options: [
      "自分の人件費や在庫コストも仕事のコストとして意識する",
      "在庫は資産なので、どれだけ持ってもコストには関係しない",
      "コストは経理部門だけが考えればよい",
      "売上が増えればコストは無視できる",
    ],
    correctIndexes: [0],
    explanation:
      "コスト意識では、自分にかかる人件費、在庫に伴う保管・資金・陳腐化などのコストも含めて考える必要がある。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 コスト意識とは?",
      quote:
        "仕事を進めるうえでは、自分にかかるコストや在庫にかかるコストも意識する必要がある。",
    },
  },
  {
    id: "keisu-muri-muda-mura-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第1章",
    topic: "ムリ・ムダ・ムラ",
    importance: "normal",
    prompt: "ムリ・ムダ・ムラの説明として正しいものをすべて選べ。",
    options: [
      "ムリは能力以上の負荷、ムダは能力以下しか使えていない状態、ムラはムリとムダが混在する状態",
      "ムリは在庫、ムダは売上、ムラは利益のこと",
      "ムリ・ムダ・ムラは製造業だけに関係し、小売業には関係しない",
      "ムリを増やせば必ず生産性は向上する",
    ],
    correctIndexes: [0],
    explanation:
      "ムリは能力以上の負荷、ムダは能力以下しか使いこなせていない状態、ムラはムリとムダが両方含まれる状態として整理される。",
    sourceRef: {
      subjectId: "keisu",
      heading: "4 ムリ、ムダ、ムラを発見する",
      quote:
        "ムラは、ムダな状態とムリな状態が両方含まれていることです。",
    },
  },
  {
    id: "keisu-equity-ratio-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第1章",
    topic: "貸借対照表",
    importance: "high",
    prompt: "自己資本比率の計算式として正しいものをすべて選べ。",
    options: [
      "純資産 ÷ 資産合計 × 100",
      "負債 ÷ 純資産 × 100",
      "売上総利益 ÷ 売上高 × 100",
      "営業キャッシュフロー ÷ 投資キャッシュフロー × 100",
    ],
    correctIndexes: [0],
    explanation:
      "自己資本比率は、資産に対する純資産の比率であり、企業の健全性を評価する重要な指標。",
    sourceRef: {
      subjectId: "keisu",
      heading: "2 貸借対照表で会社の健全性を判断する",
      quote:
        "自己資本比率（%） = 純資産 / 資産合計 x 100",
    },
  },
  {
    id: "keisu-free-cash-flow-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第1章",
    topic: "キャッシュフロー",
    importance: "normal",
    prompt: "フリーキャッシュフローの説明として正しいものをすべて選べ。",
    options: [
      "営業活動によるキャッシュフローと投資活動によるキャッシュフローを合わせたもの",
      "売上高から売上原価を差し引いたもの",
      "固定費を限界利益率で割ったもの",
      "期首在庫と期末在庫の差額",
    ],
    correctIndexes: [0],
    explanation:
      "フリーキャッシュフローは、営業活動によるキャッシュフローと投資活動によるキャッシュフローを合わせたもの。プラスであれば健全な経営と判断しやすい。",
    sourceRef: {
      subjectId: "keisu",
      heading: "3 キャッシュフロー計算書で資金の流れをみる",
      quote:
        "営業活動によるキャッシュフローと投資活動によるキャッシュフローを合わせたものをフリーキャッシュフローといい、これがプラスであれば、健全な経営を行っているということができます。",
    },
  },
  {
    id: "keisu-operating-profit-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第1章",
    topic: "損益計算書",
    importance: "normal",
    prompt: "営業利益の意味として正しいものをすべて選べ。",
    options: [
      "売上総利益から販売費・一般管理費を差し引いた、本業で獲得した利益",
      "法人税などを支払った後の最終利益",
      "特別利益から特別損失を差し引いた利益",
      "営業外収益だけを集計した利益",
    ],
    correctIndexes: [0],
    explanation:
      "営業利益は、売上総利益から販売費や一般管理費を差し引いたもので、本業で獲得した利益を意味する。",
    sourceRef: {
      subjectId: "keisu",
      heading: "4 損益計算書によって会社の収益力がわかる",
      quote:
        "営業利益は会社の本業で獲得した利益を意味します。",
    },
  },
  {
    id: "keisu-break-even-definition-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "損益分岐点",
    importance: "high",
    prompt: "損益分岐点の説明として正しいものをすべて選べ。",
    options: [
      "売上と費用がちょうど一致する売上高",
      "売上が最大になる売上高",
      "固定費がゼロになる売上高",
      "在庫数量が最小になる売上高",
    ],
    correctIndexes: [0],
    explanation:
      "損益分岐点は黒字と赤字の境であり、売上と費用がちょうど一致する売上高を指す。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 損益分岐点は黒字と赤字の境",
      quote:
        "売上と費用が一致する売上高を損益分岐点と呼びます。",
    },
  },
  {
    id: "keisu-break-even-quantity-001",
    type: "case",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "損益分岐点",
    importance: "high",
    prompt: "会費5,000円、1人あたり飲食代3,000円、固定費として席料50,000円の場合、損益分岐点人数は何人か。",
    options: ["10人", "20人", "25人", "30人"],
    correctIndexes: [2],
    explanation:
      "1人あたり限界利益は5,000円−3,000円=2,000円。固定費50,000円÷2,000円=25人が損益分岐点人数。",
    sourceRef: {
      subjectId: "keisu",
      heading: "3 損益分岐点とその求め方",
      quote:
        "損益分岐点参加人数 = 50,000円(固定費) / 2,000円(1人あたり限界利益) = 25人",
    },
  },
  {
    id: "keisu-margin-profit-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "限界利益",
    importance: "high",
    prompt: "限界利益の計算式として正しいものをすべて選べ。",
    options: [
      "売上高 − 変動費",
      "売上高 − 固定費",
      "固定費 ÷ 変動費",
      "純資産 ÷ 資産合計",
    ],
    correctIndexes: [0],
    explanation:
      "限界利益は売上高から変動費を差し引いた金額。固定費を回収し、利益を生み出す力を見るために使う。",
    sourceRef: {
      subjectId: "keisu",
      heading: "3 損益分岐点とその求め方",
      quote:
        "限界利益とは、売上高から変動費を引いた金額です。",
    },
  },
  {
    id: "keisu-safety-margin-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "安全余裕率",
    importance: "normal",
    prompt: "損益分岐点比率が66.6%の場合、安全余裕率はおよそ何%か。",
    options: ["12.5%", "25.0%", "33.3%", "66.6%"],
    correctIndexes: [2],
    explanation:
      "安全余裕率は100−損益分岐点比率で求める。100−66.6=33.4なので、およそ33.3%。",
    sourceRef: {
      subjectId: "keisu",
      heading: "4 損益分岐点比率と安全余裕率",
      quote:
        "安全余裕率(%) = 100 - 損益分岐点比率(%)",
    },
  },
  {
    id: "keisu-sunk-cost-001",
    type: "case",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "採算計算",
    importance: "high",
    prompt: "すでに支払って返還されない手付金は、住宅Aと住宅Bのどちらを選ぶかの意思決定でどう扱うべきか。",
    options: [
      "必ず住宅Aの将来原価として加える",
      "判断に影響しない埋没原価として扱う",
      "住宅Bの固定費として扱う",
      "限界利益として加算する",
    ],
    correctIndexes: [1],
    explanation:
      "すでに支出され、どちらを選んでも返ってこない金額は意思決定に影響しない。採算計算では将来増減する収入・費用を対象にする。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1. 採算計算における原価とは？",
      quote:
        "手付金の5,000千円は、住宅A、住宅Bどちらを購入するのかという判断には関係がなく埋没原価となります。",
    },
  },
  {
    id: "keisu-depreciation-method-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "減価償却",
    importance: "normal",
    prompt: "減価償却について正しいものをすべて選べ。",
    options: [
      "固定資産の取得価額は必ず購入年度に全額費用化する",
      "固定資産の取得価額を使用期間にわたって分割して費用化する",
      "減価償却費は現金支出を伴うため、毎年必ず資金が流出する",
      "定額法と定率法は毎期自由に切り替えるべきである",
    ],
    correctIndexes: [1],
    explanation:
      "建物や機械などの固定資産の取得価額は、使用期間にわたって分割して費用化する。これが減価償却費。",
    sourceRef: {
      subjectId: "keisu",
      heading: "2. 減価償却費の影響を理解する",
      quote:
        "固定資産の使用期間の間、分割されて費用となります。この費用を減価償却費、使用期間を耐用年数といいます。",
    },
  },
  {
    id: "keisu-outsourcing-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "外注化",
    importance: "normal",
    prompt: "外注化などの採算判断で重視すべき費用について、正しいものをすべて選べ。",
    options: [
      "過去に発生済みで、判断しても変わらない費用",
      "判断によって将来増加または減少する費用",
      "会計上の全部原価だけ",
      "売上高に関係なく常にゼロになる費用",
    ],
    correctIndexes: [1],
    explanation:
      "採算計算では、意思決定によって将来増える費用や減る費用を対象にする。過去に発生し判断しても変わらない費用は対象外。",
    sourceRef: {
      subjectId: "keisu",
      heading: "3. 外注化は損か得か",
      quote:
        "採算性については、売上、費用、利益の3つの視点から検討する必要があります。",
    },
  },
  {
    id: "keisu-process-improvement-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第4章",
    topic: "業務改善",
    importance: "normal",
    prompt: "業務改善の基本手順として正しいものをすべて選べ。",
    options: [
      "改善案の実施 → 問題点の把握 → 業務の実態把握 → 改善案の立案",
      "業務の実態把握 → 問題点の把握 → 改善案の立案 → 改善案の実施・定着化",
      "問題点の把握 → 実態把握を省略 → 改善案の実施",
      "販売予測 → 経理処理 → 人事評価 → 休暇取得",
    ],
    correctIndexes: [1],
    explanation:
      "業務改善は、業務の実態把握、問題点の把握、改善案の立案、改善案の実施・定着化という順で進める。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 業務改善の進め方",
      quote:
        "業務改善は、①業務の実態把握、②問題点の把握、③改善案の立案、④改善案の実施・定着化という手順で進めます。",
    },
  },
  {
    id: "keisu-sales-analysis-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第4章",
    topic: "売上分析",
    importance: "normal",
    prompt: "客単価が下がった原因を分解して考える場合に見るべき基本要素をすべて選べ。",
    options: [
      "1点単価と買上点数",
      "自己資本比率と固定比率",
      "法定労働時間と休憩時間",
      "受容と共感",
    ],
    correctIndexes: [0],
    explanation:
      "小売業の売上分析では、客単価を1点単価と買上点数などに分解して原因を探る。どちらが変化したかを見ることで改善点を絞れる。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 小売業における売上高の分析方法",
      quote:
        "買上点数が客単価減少の原因ということができます。",
    },
  },
  {
    id: "member-praise-truefalse-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第3章",
    topic: "ほめ方",
    importance: "high",
    prompt: "次の記述のうち、「ほめる」と「おだてる」の説明として正しいものをすべて選べ。",
    options: [
      "ほめるとは、根拠のある適正な評価を意味する。",
      "おだてるとは、権限に基づく適正な評価を意味する。",
      "ほめる効果は、相手が認めてもらいたいことをほめられたと納得したときに発揮される。",
      "ほめるかどうかの決定権は、常にほめる側にある。",
    ],
    correctIndexes: [0, 2],
    explanation:
      "教材では、ほめるは根拠ある適正な評価、おだてるは根拠のない過剰な評価と整理される。また、ほめる効果は相手側の納得によって成立する。",
    sourceRef: {
      subjectId: "member",
      heading: "1-1 “ほめる”と“おだてる”の違い",
      quote:
        "ほめるとは、「根拠のある適正な評価」を意味し、おだてるとは、「根拠のない過剰な評価」を意味します。",
    },
  },
  {
    id: "member-praise-principle-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第3章",
    topic: "ほめ方",
    importance: "normal",
    prompt: "次の記述のうち、ほめ方の原則として正しいものをすべて選べ。",
    options: [
      "何をほめようとしているかを明らかにしておく。",
      "不純な動機があっても、部下のためなら大げさにほめる。",
      "相手のよい点を日ごろから見つけるよう努力する。",
      "口先だけでも頻度が多ければ、相手は必ずほめられた感じをもつ。",
    ],
    correctIndexes: [0, 2],
    explanation:
      "ほめ方では、対象と目的を明確にし、日ごろから相手のよい点を見つけることが重要。大げささや口先だけの言葉は原則から外れる。",
    sourceRef: {
      subjectId: "member",
      heading: "2-2 ほめ方の原則",
      quote:
        "何をほめようとしているかを明らかにしておく。相手のよい点を日ごろから見つけるよう努力し、「ほめる」ことを習慣にする。",
    },
  },
  {
    id: "member-scold-truefalse-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第3章",
    topic: "叱り方",
    importance: "high",
    prompt: "次の記述のうち、「叱る」と「怒る」の説明として誤っているものをすべて選べ。",
    options: [
      "叱るとは、合理的な理由による理性的な問題点の指摘である。",
      "怒るとは、合理的な理由による感情的な問題点の指摘である。",
      "叱ることと怒ることは、相手への影響が同じなので区別しなくてよい。",
      "感情的な指摘になると、叱ることの効果が失われるおそれがある。",
    ],
    correctIndexes: [2],
    explanation:
      "教材では、叱るは理性的、怒るは感情的な問題点の指摘と区別される。感情的になると相手の感情を損ね、OJTとしての効果が落ちる。",
    sourceRef: {
      subjectId: "member",
      heading: "4-1 “叱る”と“怒る”の違い",
      quote:
        "叱るとは、「合理的な理由による理性的な問題点の指摘」を意味し、怒るとは、「合理的な理由による感情的な問題点の指摘」を意味します。",
    },
  },
  {
    id: "member-trust-network-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第4章",
    topic: "信頼関係",
    importance: "normal",
    prompt: "次の記述のうち、マネジャーの信頼関係の構築として正しいものをすべて選べ。",
    options: [
      "メンバーとの直接的な信頼だけでなく、経営層や他部門、顧客との関係も問われる。",
      "創造性の高い仕事は自部署内だけで完結するため、外部との協働は基本的に不要である。",
      "広範な信頼関係は、メンバーの仕事を支援する力にもなる。",
      "経営層との関係が弱くても、親身な相談対応だけで高次の仕事は必ず成功する。",
    ],
    correctIndexes: [0, 2],
    explanation:
      "第4章では、マネジャーは人的交流の中核として、直接の部下だけでなく組織内外の信頼関係を広げる必要があると説明される。",
    sourceRef: {
      subjectId: "member",
      heading: "1-2 広範な信頼関係の構築はマネジャーの能力要件",
      quote:
        "メンバーがより高い次元での仕事を成功させるためには、マネジャーもより高い次元、広い範囲での信頼関係を構築して、両者のバランスを図ることが求められます。",
    },
  },
  {
    id: "member-external-network-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第4章",
    topic: "人的ネットワーク",
    importance: "normal",
    prompt: "次の記述のうち、社外ネットワークづくりの説明として正しいものをすべて選べ。",
    options: [
      "良質な情報は、信頼関係の築かれた人から得られる。",
      "名刺の枚数が多ければ、人脈の質は問わなくてよい。",
      "社外の人とは対等な関係なので、ギブ・アンド・テイクを意識する。",
      "外部情報は不確かなものが多いため、マネジャーは社外接点を避けるべきである。",
    ],
    correctIndexes: [0, 2],
    explanation:
      "社外ネットワークでは量より質が問われる。信頼できる情報は、面識と理解のある関係から得られ、対等な関係での相互利益が重要になる。",
    sourceRef: {
      subjectId: "member",
      heading: "2-2 社外ネットワークづくりのポイント",
      quote:
        "信頼できる質の高い情報は、お互いに面識があり、理解しあえる信頼関係の築かれた人から得られるものです。",
    },
  },
  {
    id: "member-trust-attitude-001",
    type: "trueFalse",
    subjectId: "member",
    chapter: "第4章",
    topic: "信頼を得る姿勢",
    importance: "normal",
    prompt: "次の記述のうち、信頼感をもたれるための要件として正しいものをすべて選べ。",
    options: [
      "仕事熱心であること",
      "利他的であること",
      "責任をとらずにメンバーへ任せ切ること",
      "自分の権限を自分の利益のためだけに用いること",
    ],
    correctIndexes: [0, 1],
    explanation:
      "教材の図表では、信頼感をもたれるための要件として、仕事熱心であること、利他的であること、責任をとることが示される。",
    sourceRef: {
      subjectId: "member",
      heading: "3-1 信頼感をもたれるための要件",
      quote:
        "信頼感をもたれるための要件として、仕事熱心であること、利他的であること、責任をとることが示されています。",
    },
  },
  {
    id: "roumu-working-time-truefalse-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "労働時間",
    importance: "high",
    prompt: "次の記述のうち、労働時間の説明として正しいものをすべて選べ。",
    options: [
      "実労働時間には、使用者の指揮監督下にある手待ち時間も含まれる。",
      "休憩時間中に電話対応のため待機させていても、実際に電話がなければ必ず休憩時間になる。",
      "法定労働時間は原則として1週40時間、1日8時間である。",
      "会社の指示で定期的に行う清掃は、一般に労働時間とはなり得ない。",
    ],
    correctIndexes: [0, 2],
    explanation:
      "使用者の指揮監督下に置かれている手待ち時間は労働時間に含まれる。法定労働時間の原則は1週40時間、1日8時間。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1 労働時間はどこまでの範囲をさす？",
      quote:
        "実労働時間は、従業員がどんな形にせよ使用者の指揮監督下におかれている時間のことをいいます。",
    },
  },
  {
    id: "roumu-training-time-truefalse-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "時間外研修",
    importance: "high",
    prompt: "次の記述のうち、時間外の研修や講習会の扱いとして正しいものをすべて選べ。",
    options: [
      "出席が自由意思に任され希望者のみであれば、労働時間とはならない場合がある。",
      "業務命令で参加させる研修は、使用者の指揮監督下にあるため労働時間になる。",
      "強制参加ではないと説明しておけば、出欠確認や不利益取扱いがあっても労働時間にはならない。",
      "始業前の体操は、強制参加や遅刻扱いがあっても労働時間とはならない。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "研修や朝礼などは、自由参加で不利益取扱いがなければ労働時間でない場合がある。一方、業務命令や実質強制なら労働時間になる。",
    sourceRef: {
      subjectId: "roumu",
      heading: "2 時間外に実施している勉強会の扱いは？",
      quote:
        "研修や講習会への出席が業務命令で行われている場合には、使用者の指揮監督下にあるものとみなされ、労働時間になります。",
    },
  },
  {
    id: "roumu-break-truefalse-002",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "休憩",
    importance: "high",
    prompt: "次の記述のうち、休憩時間の与え方として正しいものをすべて選べ。",
    options: [
      "労働時間が6時間以下の場合、休憩時間を与えなくてもよい。",
      "労働時間が6時間を超え8時間以下の場合、45分以上の休憩が必要である。",
      "労働時間が8時間を超える場合、45分以上の休憩で足りる。",
      "休憩時間は終業後にまとめて与えてもよい。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "休憩は6時間以下なら不要、6時間超8時間以下なら45分以上、8時間超なら1時間以上を労働時間の途中に与える。",
    sourceRef: {
      subjectId: "roumu",
      heading: "7 休憩を与えるうえでの留意点は？",
      quote:
        "労働時間が6時間以下の場合には休憩時間を与える必要はありません。6時間を超え8時間以下の場合は45分以上、8時間を超える場合は1時間以上の休憩時間を、労働時間の途中に与えなければなりません。",
    },
  },
  {
    id: "roumu-handaki-temachi-truefalse-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第1章",
    topic: "手あき時間と手待ち時間",
    importance: "normal",
    prompt: "次の記述のうち、「手あき時間」と「手待ち時間」の説明として誤っているものをすべて選べ。",
    options: [
      "使用者の指揮監督下にあり仕事のため待機している時間は、手待ち時間として労働時間に含まれる。",
      "仕事から離れ、まったく自由に利用できる時間は、手あき時間として休憩時間とみなしてよい。",
      "手あき時間も手待ち時間も、常に労働時間として扱う。",
      "実際に作業していなければ、仕事のため待機していても休憩時間になる。",
    ],
    correctIndexes: [2, 3],
    explanation:
      "手待ち時間は労働時間に含まれるが、仕事から離れて自由に使える手あき時間は休憩時間とみなせる。実作業の有無だけで判断しない。",
    sourceRef: {
      subjectId: "roumu",
      heading: "8 「手あき時間」と「手待ち時間」の違いは？",
      quote:
        "従業員が仕事から離れ、まったく自由に利用できる時間であれば手あき時間となり、休憩時間とみなしてよいとされています。",
    },
  },
  {
    id: "roumu-paid-leave-truefalse-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第2章",
    topic: "年次有給休暇",
    importance: "high",
    prompt: "次の記述のうち、年次有給休暇の説明として正しいものをすべて選べ。",
    options: [
      "年次有給休暇の利用目的は労働者の自由であり、使用者は基本的に理由で拒めない。",
      "届出理由が虚偽だった場合、取得済みの年次有給休暇は必ず取り消せる。",
      "年10日以上の年次有給休暇が付与される労働者には、年5日の取得に関する時季指定義務がある。",
      "年次有給休暇管理簿の保存は不要である。",
    ],
    correctIndexes: [0, 2],
    explanation:
      "年休の利用目的は自由であり、理由で許否を判断できない。年10日以上付与される労働者には年5日の取得義務があり、管理簿保存も必要。",
    sourceRef: {
      subjectId: "roumu",
      heading: "1 年次有給休暇の届出理由にウソが発覚。取消し処置は可能？",
      quote:
        "年次有給休暇の利用目的は、労働者の自由であり使用者の干渉を許さないものとされています。",
    },
  },
  {
    id: "roumu-season-change-truefalse-001",
    type: "trueFalse",
    subjectId: "roumu",
    chapter: "第2章",
    topic: "時季変更権",
    importance: "high",
    prompt: "次の記述のうち、時季変更権の説明として正しいものをすべて選べ。",
    options: [
      "時季変更権は、事業の正常な運営を妨げる場合に限って行使できる。",
      "使用者が代替要員確保の努力をせずに時季変更権を使うと、濫用となるおそれがある。",
      "就業規則の届出期限を過ぎた申出は、事業への影響に関係なく必ず拒否できる。",
      "退職日以降に変更すべき日がない場合でも、退職前の年休請求は一律に拒否できる。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "時季変更権は例外的な権利で、事業の正常な運営を妨げる明確な理由が必要。代替要員確保の努力なしの行使は濫用になり得る。",
    sourceRef: {
      subjectId: "roumu",
      heading: "2 年次有給休暇の時季変更権はどんなときに使える？",
      quote:
        "時季変更権は、「事業の正常な運営を妨げる」場合に該当するときに限って行使できるものです。",
    },
  },
  {
    id: "keisu-cost-purpose-truefalse-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第2章",
    topic: "原価計算",
    importance: "high",
    prompt: "次の記述のうち、原価計算の目的として正しいものをすべて選べ。",
    options: [
      "正しい決算書を作成する。",
      "販売価格を決定する。",
      "原価の管理は、原価計算の目的には含まれない。",
      "労働時間の時季変更権を判断する。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "原価計算の目的は、正しい決算書作成、販売価格決定、原価管理、採算計算の4点。労務管理上の時季変更権とは別領域。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 なぜ原価計算を行うのか",
      quote:
        "原価計算を行う目的は、正しい決算書を作成する、販売価格を決定する、原価の管理を行う、採算計算を行う、という4点があげられます。",
    },
  },
  {
    id: "keisu-break-even-safety-truefalse-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "安全余裕率",
    importance: "high",
    prompt: "次の記述のうち、損益分岐点比率と安全余裕率の説明として正しいものをすべて選べ。",
    options: [
      "損益分岐点比率は、損益分岐点売上高を現状の売上高で割って100を掛ける。",
      "安全余裕率は、100から損益分岐点比率を引いて求める。",
      "損益分岐点比率は高ければ高いほど安全性が高い。",
      "損益分岐点比率70%未満は、赤字に転落するリスクがかなり高い危険な状態の目安である。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "損益分岐点比率は低いほど安全性が高い。安全余裕率は100から損益分岐点比率を引く。100%以上は赤字状態の目安。",
    sourceRef: {
      subjectId: "keisu",
      heading: "4 損益分岐点比率と安全余裕率",
      quote:
        "安全余裕率の計算式は、100 - 損益分岐点比率です。損益分岐点比率は、経営の安全性を表しています。",
    },
  },
  {
    id: "keisu-cost-term-truefalse-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第3章",
    topic: "原価用語",
    importance: "normal",
    prompt: "次の記述のうち、製造原価と売上原価の説明として正しいものをすべて選べ。",
    options: [
      "製造原価は、材料費、労務費、経費の3つから構成される。",
      "期末にまだ完成していないものは、仕掛品の製造原価となる。",
      "販売業の売上原価は、期首在庫と当期仕入分と期末在庫を一切考慮しない。",
      "完成品は在庫にならず、完成した時点ですべて売上原価になる。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "製造原価は材料費・労務費・経費から成り、未完成分は仕掛品となる。販売された分の原価が売上原価として扱われる。",
    sourceRef: {
      subjectId: "keisu",
      heading: "5 原価に関する用語の整理",
      quote:
        "製造原価は、第2章で学習したように、原価の3要素と呼ばれる材料費、労務費、経費の3つから構成されます。",
    },
  },
  {
    id: "keisu-benchmarking-truefalse-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第4章",
    topic: "ベンチマーキング",
    importance: "normal",
    prompt: "次の記述のうち、ベンチマーキング手法の説明として正しいものをすべて選べ。",
    options: [
      "パフォーマンスのよい他部門や他社などの事例を研究し、ベストプラクティスを参考にする。",
      "自社や自部門の経験だけに頼らず、先進事例から発想を得る。",
      "同業他社以外は対象に含めてはならない。",
      "業務改善では情報収集よりも、現場の勘だけを重視する。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "ベンチマーキングは先進事例研究であり、他部門、同業他社、異業種企業などを対象にベストプラクティスを学ぶ方法。",
    sourceRef: {
      subjectId: "keisu",
      heading: "1 ベンチマーキング手法とは？",
      quote:
        "パフォーマンスのよい他部門や同業他社、異業種企業、世界のエクセレントカンパニーなどの事例を徹底的に研究し、ベストプラクティスを把握して、それを参考にしようという方法です。",
    },
  },
  {
    id: "keisu-inventory-truefalse-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第4章",
    topic: "在庫改善",
    importance: "high",
    prompt: "次の記述のうち、在庫改善の説明として正しいものをすべて選べ。",
    options: [
      "発注日の適正在庫は、リードタイムの日数、1日あたりの販売数量、安全在庫を用いて考える。",
      "安全在庫は、販売数量が予測より多かった場合の欠品を防ぐための余分な在庫である。",
      "適正在庫とは、販売数に関係なく全品目で同じ数量を持つことである。",
      "在庫改善では、一品一品の適正在庫数を割り出す必要はない。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "在庫改善では、リードタイム中の販売数量と安全在庫を考え、品切れを起こさず販売数に応じた数量を適正在庫として割り出す。",
    sourceRef: {
      subjectId: "keisu",
      heading: "2 在庫改善",
      quote:
        "発注日の適正在庫 = リードタイムの日数 x 1日あたりの販売数量 + 安全在庫",
    },
  },
  {
    id: "keisu-inventory-calc-001",
    type: "trueFalse",
    subjectId: "keisu",
    chapter: "第4章",
    topic: "在庫改善",
    importance: "normal",
    prompt: "商品Aはリードタイム2日、1日あたり平均販売数量4個、安全在庫4個である。次の記述のうち正しいものをすべて選べ。",
    options: [
      "発注日の適正在庫は12個である。",
      "リードタイム中に販売される見込み数量は8個である。",
      "安全在庫を含めずに考えると、発注日の適正在庫は4個である。",
      "安全在庫は、納品直前の欠品リスクとは無関係である。",
    ],
    correctIndexes: [0, 1],
    explanation:
      "計算式は 2日 x 4個 + 4個 = 12個。リードタイム中の販売見込みは8個で、安全在庫4個を加える。",
    sourceRef: {
      subjectId: "keisu",
      heading: "2 在庫改善",
      quote:
        "商品Aの発注日の適正在庫 = 2日 x 4個 + 4個 = 12個",
    },
  },
];

export const questions: QuizQuestion[] = [
  ...baseQuestions,
  ...memberAdditions,
  ...roumuAdditions,
  ...keisuAdditions,
  ...memberC1Additions,
  ...memberC2Additions,
  ...memberC34Additions,
  ...roumuC1Additions,
  ...roumuC23Additions,
  ...roumuC456Additions,
  ...keisuC01Additions,
  ...keisuC2Additions,
  ...keisuC34Additions,
];
