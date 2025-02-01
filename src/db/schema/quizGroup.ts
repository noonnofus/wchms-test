import { int, mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core";

export const quizGroups = mysqlTable("quiz_groups", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    internalNote: text("internal_note"),
    status: varchar("status", { length: 50 }).notNull(),
    sortOrder: int("sort_order"),
});
