import {
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";

enum MessageStatus {
    draft = "draft",
    published = "published",
    notified = "notified",
}

const messageStatusEnumValues = [
    MessageStatus.draft,
    MessageStatus.published,
    MessageStatus.notified,
] as const;

export const messages = mysqlTable("messages", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    status: mysqlEnum("status", messageStatusEnumValues).notNull(),
    owner_id: int("owner_id"),
    recipient_id: int("recipient_id"),
    forum_id: int("forum_id"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});
