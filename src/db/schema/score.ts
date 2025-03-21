import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { participants } from "./participants";
import { users } from "./users";
import { Sessions } from "./session";

export const Scores = mysqlTable("scores", {
    id: int("id").primaryKey(),
    time: int("time").notNull(),
    note: varchar("note", { length: 255 }),
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
