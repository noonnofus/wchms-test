import { int, mysqlEnum, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { Courses } from "./course";
import { users } from "./users";

export const Sessions = mysqlTable("sessions", {
    id: int("id").primaryKey().autoincrement(),
    courseId: int("course_id")
        .notNull()
        .references(() => Courses.id, { onDelete: "cascade" }),
    instructorId: int("instructor_id").references(() => users.id, {
        onDelete: "set null",
    }),
    date: timestamp("date").notNull(),
    startTime: timestamp("start").notNull(),
    endTime: timestamp("end").notNull(),
    status: mysqlEnum("status", ["Available", "Completed"]).notNull(),
});

export type Session = typeof Sessions.$inferSelect;
