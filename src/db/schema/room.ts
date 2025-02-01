import { mysqlTable, serial, varchar, mysqlEnum, date, int } from "drizzle-orm/mysql-core";

enum RoomStatus {
    available = "available",
    unavailable = "unavailable",
}

const roomStatusValues = [RoomStatus.available, RoomStatus.unavailable] as const;

enum RoomMedium {
    online = "online",
    offline = "offline",
}

const roomMediumValues = [RoomMedium.online, RoomMedium.offline] as const;

export const rooms = mysqlTable("rooms", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    internalNote: varchar("internal_note", { length: 255 }),
    url: varchar("url", { length: 255 }),
    capacity: int("capacity"),
    medium: mysqlEnum("medium", roomMediumValues).notNull(),
    status: mysqlEnum("status", roomStatusValues).notNull(),
});
