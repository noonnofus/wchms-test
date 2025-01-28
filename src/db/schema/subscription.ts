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

enum SubscriptionPeriod {
    monthly = "monthly",
    quarterly = "quarterly",
    yearly = "yearly",
}

const subscriptionPeriodEnumValues = [
    SubscriptionPeriod.monthly,
    SubscriptionPeriod.quarterly,
    SubscriptionPeriod.yearly,
] as const;

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

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    birthDate: date("birth_date"),
    gender: mysqlEnum("gender", ["male", "female", "other"] as const).notNull(),
    building: varchar("building", { length: 255 }),
    street: varchar("street", { length: 255 }),
    city: varchar("city", { length: 255 }).notNull(),
    province: varchar("province", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    postalCode: varchar("postal_code", { length: 255 }),
    timezone: varchar("timezone", { length: 255 }).default("America/Vancouver"),
    lang: varchar("lang", { length: 255 }).default("en"),
    role: mysqlEnum("role", ["client", "staff", "admin"] as const).default(
        "client"
    ),
    status: mysqlEnum("status", ["active", "inactive"] as const).default(
        "active"
    ),
    courseId: varchar("course_id", { length: 255 }),
});
