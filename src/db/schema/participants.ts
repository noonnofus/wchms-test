import {
    mysqlEnum,
    mysqlTable,
    varchar,
    int,
    date,
} from "drizzle-orm/mysql-core";

export const participants = mysqlTable("participants", {
    id: int("id").primaryKey().autoincrement().notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    dateOfBirth: date("date_of_birth").notNull(),
    gender: mysqlEnum("gender", ["Male", "Female", "Other"]),
});
export type Participant = typeof participants.$inferSelect;
