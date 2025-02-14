import { mysqlEnum, mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    password: varchar("password", { length: 255 }),
    gender: mysqlEnum("gender", ["male", "female", "other"]),
    role: mysqlEnum("role", ["participant", "admin", "staff"]).default(
        "participant"
    ),
});
export type User = typeof users.$inferSelect;
