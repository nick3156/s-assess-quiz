CREATE TABLE IF NOT EXISTS answers (
  question_id TEXT NOT NULL,
  answered_at TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  selected_indexes TEXT NOT NULL,
  PRIMARY KEY (question_id, answered_at)
);
