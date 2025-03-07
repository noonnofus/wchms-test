import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { uploadMedia } from "./mediaUpload";
import { Participant, participants } from "./participants";
import { rooms } from "./room";
import { CourseMaterialsWithFile } from "./courseMaterials";

export const Courses = mysqlTable("courses", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    start: timestamp("start").notNull(),
    end: timestamp("end"),
    kind: varchar("kind", { length: 100 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    lang: varchar("lang", { length: 10 }).notNull(),
    uploadId: int("upload_id").references(() => uploadMedia.id, {
        onDelete: "set null",
    }),
    roomId: int("room_id").references(() => rooms.id),
});

export const CourseParticipant = mysqlTable("course_participants", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => participants.id, { onDelete: "cascade" }),
    courseId: int("course_id")
        .notNull()
        .references(() => Courses.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }),
    subscriptionId: int("subscription_id"),
});

export type Course = typeof Courses.$inferSelect;

export interface CourseFull extends Course {
    fileKey: string | null;
    imageUrl?: string | null;
    materials?: CourseMaterialsWithFile[] | null;
    participants?: Participant[] | null;
}
