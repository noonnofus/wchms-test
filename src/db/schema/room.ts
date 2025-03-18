import { mysqlTable, varchar, mysqlEnum, int } from "drizzle-orm/mysql-core";

export enum RoomStatus {
    available = "available",
    unavailable = "unavailable",
}

const roomStatusValues = [
    RoomStatus.available,
    RoomStatus.unavailable,
] as const;

export enum RoomMedium {
    online = "online",
    InPerson = "in-person",
}

const roomMediumValues = [RoomMedium.online, RoomMedium.InPerson] as const;

export const rooms = mysqlTable("rooms", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    internalNote: varchar("internal_note", { length: 255 }),
    url: varchar("url", { length: 255 }),
    capacity: int("capacity"),
    medium: mysqlEnum("medium", roomMediumValues).notNull(),
    status: mysqlEnum("status", roomStatusValues).notNull(),
});

export type Room = typeof rooms.$inferSelect;
