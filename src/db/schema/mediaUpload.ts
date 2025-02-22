import {
    int,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";

export const uploadMedia = mysqlTable("upload_media", {
    id: int("id").primaryKey().autoincrement(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 50 }).notNull(),
    fileSize: int("file_size").notNull(),
    fileData: text("file_data").notNull(),
    mediaOrigin: varchar("media_origin", { length: 50 }).notNull(),
    originId: int("origin_id").notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export type UploadMedia = typeof uploadMedia.$inferSelect;
