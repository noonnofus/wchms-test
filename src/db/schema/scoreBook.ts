import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const ScoreBook = mysqlTable("score_books", {
    id: int("score_book_id").primaryKey(),
    time: timestamp("time").notNull(),
    str_time: varchar("str_time", { length: 255 }),
    comment: varchar("comment", { length: 255 }),
    material: varchar("material", { length: 255 }),
    internal_note: varchar("internal_note", { length: 255 }),
    method: varchar("method", { length: 100 }).notNull(),
    userId: int("user_id").notNull(), //reference with user_id
    instructorId: int("instructor_id"), //reference with instructor_id
    sessionId: int("session_id").notNull(), //reference with session_id
});
