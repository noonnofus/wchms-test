import {
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { UploadMedia, uploadMedia } from "./mediaUpload";
import { Courses } from "./course";

export enum MaterialType {
    arithmetic = "Simple Arithmetic",
    reading = "Reading Aloud",
    exercise = "Physical Exercise",
}

export enum Difficulty {
    basic = "Basic",
    intermediate = "Intermediate",
}

const materialTypeEnumValues = [
    MaterialType.arithmetic,
    MaterialType.reading,
    MaterialType.exercise,
] as const;

const difficultyEnumValues = [
    Difficulty.basic,
    Difficulty.intermediate,
] as const;

export const courseMaterials = mysqlTable("course_materials", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    type: mysqlEnum("type", materialTypeEnumValues).notNull(),
    difficulty: mysqlEnum("difficulty", difficultyEnumValues).notNull(),
    description: text("description"),
    uploadId: int("upload_id").references(() => uploadMedia.id),
    courseId: int("course_id")
        .notNull()
        .references(() => Courses.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
    url: varchar("url", { length: 2083 }),
});

export type CourseMaterials = typeof courseMaterials.$inferSelect;

export interface CourseMaterialsWithFile extends CourseMaterials {
    file: {
        fileName: UploadMedia["fileName"];
        fileType: UploadMedia["fileType"];
        fileSize: UploadMedia["fileSize"];
        fileData: UploadMedia["fileData"];
    } | null;
}
