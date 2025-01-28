import {
    date,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { Course } from "./course";

enum AssignmentKind {
    homework = "homework",
    report = "report",
}

const assignmentKindEnumValues = [
    AssignmentKind.homework,
    AssignmentKind.report,
] as const;

export const assignments = mysqlTable("assignments", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    kind: mysqlEnum("kind", assignmentKindEnumValues).notNull(),
    description: varchar("description", { length: 255 }),
    internalNote: varchar("internal_note", { length: 255 }),
    uploadId: varchar("upload_id", { length: 255 }),
    courseId: varchar("course_id", { length: 255 })
        .notNull()
        .references(() => Course.id),
    sortOrder: int("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    birthDate: date("birth_date"),
    gender: mysqlEnum("gender", ["male", "female", "other"] as const).notNull(),
    status: mysqlEnum("status", ["active", "inactive"] as const).default(
        "active"
    ),
    role: mysqlEnum("role", ["client", "staff", "admin"] as const).default(
        "client"
    ),
    courseId: varchar("course_id", { length: 255 }),
});

export const courseParticipants = mysqlTable("course_participants", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => users.id),
    courseId: varchar("course_id", { length: 255 })
        .notNull()
        .references(() => Course.id),
    role: mysqlEnum("role", ["student", "teacher"] as const).notNull(),
});
