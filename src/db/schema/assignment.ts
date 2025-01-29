import {
    boolean,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    text,
    varchar,
} from "drizzle-orm/mysql-core";

export enum AssignmentKind {
    homework = "homework",
    report = "report",
    project = "project",
}

const assignmentKindEnumValues = [
    AssignmentKind.homework,
    AssignmentKind.report,
    AssignmentKind.project,
] as const;

export const assignments = mysqlTable("assignments", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    kind: mysqlEnum("kind", assignmentKindEnumValues).notNull(),
    description: text("description"),
    internalNote: text("internal_note"),
    uploadId: varchar("upload_id", { length: 255 }),
    courseId: varchar("course_id", { length: 255 }).notNull(),
    isAggregated: boolean("is_aggregated").default(false),
    sortOrder: int("sort_order").notNull(),
});
