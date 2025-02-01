import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const SessionAvailability = mysqlTable("session_availabilities", {
    id: int("session_availability_id").primaryKey(),
    start: timestamp("start").notNull(),
    duration: varchar("duration", { length: 50 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    courseId: int("course_id").notNull(),
    end: timestamp("end"),
});
