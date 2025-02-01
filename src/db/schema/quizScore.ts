import { mysqlTable, float, datetime, varchar } from "drizzle-orm/mysql-core";

export const quizScores = mysqlTable("quiz_scores", {
  id: varchar("id", { length: 255 }).primaryKey(),
  score: float("score").notNull(),
  start: datetime("start"),
  end: datetime("end"),
  summaryId: varchar("summary_id", { length: 255 }).notNull(),
  quizGroupId: varchar("quiz_group_id", { length: 255 }).notNull(),
  quizId: varchar("quiz_id", { length: 255 }).notNull()
});
