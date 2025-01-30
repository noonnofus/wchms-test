import { float, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const payments = mysqlTable("payments", {
    id: varchar("id", { length: 255 }).primaryKey(),
    amount: float("amount").notNull(),
    taxes: float("taxes").default(0.0),
    description: text("description"),
    metadata: text("metadata"),
    kind: varchar("kind", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    pricingId: varchar("pricing_id", { length: 255 }),
});
