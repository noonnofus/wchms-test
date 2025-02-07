import {
    text,
    mysqlEnum,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  role: mysqlEnum("role", ["participant", "admin", "staff"]).default("participant"), 
});
