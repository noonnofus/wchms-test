import {
    mysqlEnum,
    mysqlTable,
    serial,
    text,
    varchar,
} from "drizzle-orm/mysql-core";

enum OptionGroup {
    general = "general",
    advanced = "advanced",
}

const optionGroupEnumValues = [
    OptionGroup.general,
    OptionGroup.advanced,
] as const;

export const options = mysqlTable("options", {
    id: serial("id").primaryKey(),
    kind: varchar("kind", { length: 255 }).notNull(),
    group: mysqlEnum("group", optionGroupEnumValues),
    name: varchar("name", { length: 255 }).notNull(),
    data: text("data").notNull(),
});
