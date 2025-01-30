import { mysqlTable, serial, varchar, text, int, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";

enum ForumKind {
    discussion = "discussion",
    announcement = "announcement",
    question = "question",
}

enum ForumStatus {
    active = "active",
    inactive = "inactive",
    archived = "archived",
}

const forumKindEnumValues = [
    ForumKind.discussion,
    ForumKind.announcement,
    ForumKind.question,
] as const;

const forumStatusEnumValues = [
    ForumStatus.active,
    ForumStatus.inactive,
    ForumStatus.archived,
] as const;

export const forums = mysqlTable("forums", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    kind: mysqlEnum("kind", forumKindEnumValues).notNull(),
    status: mysqlEnum("status", forumStatusEnumValues).notNull(),
    owner_id: int("owner_id"),
    sort_order: int("sort_order"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});
