import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const Course = mysqlTable("courses", {
    id: int("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    start: timestamp("start").notNull(),
    end: timestamp("end"),
    deadline: timestamp("deadline"),
    kind: varchar("kind", { length: 100 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    lang: varchar("lang", { length: 10 }).notNull(),
    timezone: varchar("timezone", { length: 50 }).default("America/Vancouver"),
    categoryId: int("category_id"),
    uploadId: int("upload_id"),
    roomId: int("room_id"),
});

export const CourseParticipant = mysqlTable("course_participants", {
    id: int("id").primaryKey(),
    userId: int("user_id"),
    courseId: int("course_id").notNull(),
    status: varchar("status", { length: 50 }),
    subscriptionId: int("subscription_id"),
});
