import {
    mysqlTable,
    int,
    timestamp,
    mysqlEnum,
    uniqueIndex,
} from "drizzle-orm/mysql-core";
import { participants } from "./participants";
import { Courses } from "./course";

export const CourseJoinRequests = mysqlTable("course_join_requests", {
    id: int("id").primaryKey().autoincrement(),
    participantId: int("participant_id")
        .notNull()
        .references(() => participants.id),
    courseId: int("course_id")
        .notNull()
        .references(() => Courses.id),
    status: mysqlEnum("status", ["pending", "approved", "rejected"])
        .notNull()
        .default("pending"),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
});

export const CourseJoinRequestsUniqueConstraint = uniqueIndex(
    "participant_course_unique"
).on(CourseJoinRequests.participantId, CourseJoinRequests.courseId);

export type CourseJoinRequest = typeof CourseJoinRequests.$inferSelect;
