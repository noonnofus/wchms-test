import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { uploadMedia } from "./mediaUpload";
import { participants } from "./participants";
import { rooms } from "./room";

export const Courses = mysqlTable("courses", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    start: timestamp("start").notNull(),
    end: timestamp("end"),
    kind: varchar("kind", { length: 100 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    lang: varchar("lang", { length: 10 }).notNull(),
    uploadId: int("upload_id").references(() => uploadMedia.id),
    roomId: int("room_id").references(() => rooms.id),
});

export const CourseParticipant = mysqlTable("course_participants", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => participants.id),
    courseId: int("course_id")
        .notNull()
        .references(() => Courses.id),
    status: varchar("status", { length: 50 }),
    subscriptionId: int("subscription_id"),
});

export type Course = typeof Courses.$inferSelect;
