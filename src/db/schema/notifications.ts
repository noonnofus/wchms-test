import { relations } from "drizzle-orm";
import {
    boolean,
    int,
    json,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { participants } from "./participants";

export type NotificationType =
    | "course_material"
    | "homework"
    | "session_reminder"
    | "course_acceptance"
    | "course_invite";


export const notifications = mysqlTable("notifications", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    type: varchar("type", { length: 50 }).notNull(),
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
