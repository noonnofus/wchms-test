import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { participants } from "./participants";
import { users } from "./users";
import { Sessions } from "./session";

export const Scores = mysqlTable("scores", {
    id: int("id").primaryKey().autoincrement(),
    time: int("time").notNull(),
    participantId: int("participant_id")
        .notNull()
        .references(() => participants.id),
    instructorId: int("instructor_id").references(() => users.id, {
        onDelete: "set null",
    }),
    sessionId: int("session_id")
        .notNull()
        .references(() => Sessions.id),
});

export type Score = typeof Scores.$inferSelect;
