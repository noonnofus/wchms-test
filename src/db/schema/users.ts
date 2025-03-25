import {
    mysqlEnum,
    mysqlTable,
    varchar,
    int,
    date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement().notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    password: varchar("password", { length: 255 }).notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    gender: mysqlEnum("gender", ["Male", "Female", "Other"]),
    role: mysqlEnum("role", ["Admin", "Staff"]).default("Staff").notNull(),
});
export type User = typeof users.$inferSelect;

export type UserNoPass = Omit<User, "password">;
