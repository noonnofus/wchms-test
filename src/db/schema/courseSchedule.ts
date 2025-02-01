import {
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    time,
    varchar,
} from "drizzle-orm/mysql-core";

enum CourseScheduleKind {
    lecture = "lecture",
    seminar = "seminar",
    workshop = "workshop",
}

const courseScheduleKindEnumValues = [
    CourseScheduleKind.lecture,
    CourseScheduleKind.seminar,
    CourseScheduleKind.workshop,
] as const;

export const courseSchedules = mysqlTable("course_schedules", {
    id: serial("id").primaryKey(),
    courseId: int("course_id").notNull(),
    instructorId: int("instructor_id"),
    dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(),
    start: time("start").notNull(),
    end: time("end").notNull(),
    internalNote: varchar("internal_note", { length: 255 }),
    kind: mysqlEnum("kind", courseScheduleKindEnumValues).notNull(),
    sortOrder: int("sort_order"),
});
