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
