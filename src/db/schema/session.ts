import { int, mysqlEnum, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { Courses } from "./course";
import { rooms } from "./room";
import { users } from "./users";

export const Sessions = mysqlTable("sessions", {
    id: int("id").primaryKey().autoincrement(),
    courseId: int("course_id")
        .notNull()
        .references(() => Courses.id, { onDelete: "cascade" }),
    instructorId: int("instructor_id")
        .notNull()
        .references(() => users.id, { onDelete: "set null" }),
    date: timestamp("date").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time"),
    roomId: int("room_id").references(() => rooms.id, { onDelete: "set null" }),
    status: mysqlEnum("status", ["Draft", "Available", "Completed", "Archived"]).notNull(),
});

export type Session = typeof Sessions.$inferSelect;
