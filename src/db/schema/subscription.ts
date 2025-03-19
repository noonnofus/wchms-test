import {
    boolean,
    date,
    float,
    mysqlEnum,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";

enum SubscriptionStatus {
    pending = "pending",
    active = "active",
    cancelled = "cancelled",
}

const subscriptionStatusEnumValues = [
    SubscriptionStatus.pending,
    SubscriptionStatus.active,
    SubscriptionStatus.cancelled,
] as const;

enum SubscriptionKind {
    unlimited = "unlimited",
    single = "single",
}

const subscriptionKindEnumValues = [
    SubscriptionKind.unlimited,
    SubscriptionKind.single,
] as const;

// enum SubscriptionPeriod {
//     monthly = "monthly",
//     quarterly = "quarterly",
//     yearly = "yearly",
// }

// const subscriptionPeriodEnumValues = [ // might be needed for mutation/query
//     SubscriptionPeriod.monthly,
//     SubscriptionPeriod.quarterly,
//     SubscriptionPeriod.yearly,
// ] as const;

export const subscriptions = mysqlTable("subscriptions", {
    id: serial("id").primaryKey(),
    passKind: mysqlEnum("pass_kind", subscriptionKindEnumValues).notNull(),
    price: float("price"),
    taxPst: float("tax_pst"),
    taxGst: float("tax_gst"),
    expiryDate: date("expiry_date"),
    status: mysqlEnum("status", subscriptionStatusEnumValues).notNull(),
    payment: varchar("payment", { length: 255 }).notNull(),
    isPaid: boolean("is_paid").notNull(),
    customerNote: varchar("customer_note", { length: 255 }),
    internalNote: varchar("internal_note", { length: 255 }),
    userId: varchar("user_id", { length: 255 }).notNull(),
    courseId: varchar("course_id", { length: 255 }),
});
