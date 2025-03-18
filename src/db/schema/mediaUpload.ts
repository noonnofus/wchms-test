import {
    int,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";

export const uploadMedia = mysqlTable("upload_media", {
    id: int("id").primaryKey().autoincrement(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 50 }).notNull(),
    fileSize: int("file_size").notNull(),
    fileKey: text("file_key").notNull(), //fileData
    mediaOrigin: varchar("media_origin", { length: 50 }).notNull(),
    ownerId: int("owner_id")
        .notNull()
        .references(() => users.id), //originId
    uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export type UploadMedia = typeof uploadMedia.$inferSelect;
