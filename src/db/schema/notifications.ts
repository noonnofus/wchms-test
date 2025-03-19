import { relations } from "drizzle-orm";
import {
    boolean,
    int,
    json,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { participants } from "./participants";

export const notifications = mysqlTable("notifications", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    type: varchar("type", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    userId: int("user_id")
        .notNull()
        .references(() => participants.id, { onDelete: "cascade" }),
    isRead: boolean("is_read").notNull().default(false),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(participants, {
        fields: [notifications.userId],
        references: [participants.id],
    }),
}));
