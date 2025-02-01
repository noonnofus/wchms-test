import {
    date,
    mysqlEnum,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";

enum UserRole {
    client = "client",
    staff = "staff",
    admin = "admin",
}

const userRoleEnumValues = [
    UserRole.client,
    UserRole.staff,
    UserRole.admin,
] as const;

export enum UserGender {
    male = "male",
    female = "female",
    other = "other",
}

const userGenderEnumValues = [
    UserGender.male,
    UserGender.female,
    UserGender.other,
] as const;

enum UserStatus {
    active = "active",
    inactive = "inactive",
}

const userStatusEnumvalues = [UserStatus.active, UserStatus.inactive] as const;

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    birthDate: date("birth_date"),
    gender: mysqlEnum("gender", userGenderEnumValues).notNull(),
    building: varchar("building", { length: 255 }),
    street: varchar("street", { length: 255 }),
    city: varchar("city", { length: 255 }).notNull(),
    province: varchar("province", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    postal_code: varchar("postal_code", { length: 255 }),
    timezone: varchar("timezone", { length: 255 }).default("America/Vancouver"),
    lang: varchar("lang", { length: 255 }).default("en"),
    role: mysqlEnum("role", userRoleEnumValues).default(UserRole.client),
    status: mysqlEnum("status", userStatusEnumvalues).default(
        UserStatus.active
    ),
    courseId: varchar("course_id", { length: 255 }),
});
