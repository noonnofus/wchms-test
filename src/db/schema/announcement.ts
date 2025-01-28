import {
    date,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";

enum AnnouncementStatus {
    draft = "draft",
    published = "published",
    archived = "archived",
}

const announcementStatusEnumValues = [
    AnnouncementStatus.draft,
    AnnouncementStatus.published,
    AnnouncementStatus.archived,
] as const;

enum AnnouncementTarget {
    all_users = "all_users",
    specific_user = "specific_user",
}

const announcementTargetEnumValues = [
    AnnouncementTarget.all_users,
    AnnouncementTarget.specific_user,
] as const;

export const announcements = mysqlTable("announcements", {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 255 }).notNull(),
    start: date("start"),
    end: date("end"),
    lang: varchar("lang", { length: 255 }),
    kind: varchar("kind", { length: 255 }).notNull(),
    status: mysqlEnum("status", announcementStatusEnumValues).notNull(),
    target: mysqlEnum("target", announcementTargetEnumValues).notNull(),
    sortOrder: int("sort_order").default(0),
    userId: varchar("user_id", { length: 255 }).notNull(),
});

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    birthDate: date("birth_date"),
    gender: mysqlEnum("gender", ["male", "female", "other"] as const).notNull(),
    building: varchar("building", { length: 255 }),
    street: varchar("street", { length: 255 }),
    city: varchar("city", { length: 255 }).notNull(),
    province: varchar("province", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    postalCode: varchar("postal_code", { length: 255 }),
    timezone: varchar("timezone", { length: 255 }).default("America/Vancouver"),
    lang: varchar("lang", { length: 255 }).default("en"),
    role: mysqlEnum("role", ["client", "staff", "admin"] as const).default(
        "client"
    ),
    status: mysqlEnum("status", ["active", "inactive"] as const).default(
        "active"
    ),
    courseId: varchar("course_id", { length: 255 }),
});
