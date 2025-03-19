import { mysqlTable, varchar, float, date, text } from "drizzle-orm/mysql-core";

export const quizSummaries = mysqlTable("quiz_summaries", {
    id: varchar("id", { length: 36 }).primaryKey(),
    dateTaken: date("date_taken").notNull(),
    comment: text("comment"),
    totalScore: float("total_score").notNull(),
    maxScore: float("max_score").notNull(),
    internalNote: text("internal_note"),
    grade: varchar("grade", { length: 10 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    instructorId: varchar("instructor_id", { length: 36 }).notNull(),
    sessionId: varchar("session_id", { length: 36 }),
});
