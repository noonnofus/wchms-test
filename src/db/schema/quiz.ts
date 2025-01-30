import {
    float,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";

export enum QuizKind {
    normal = "normal",
    advanced = "advanced",
}

const quizKindEnumValues = [QuizKind.normal, QuizKind.advanced] as const;

export enum QuizStatus {
    active = "active",
    inactive = "inactive",
    draft = "draft",
}

const quizStatusEnumValues = [
    QuizStatus.active,
    QuizStatus.inactive,
    QuizStatus.draft,
] as const;

export const quizzes = mysqlTable("quizzes", {
    id: serial("id").primaryKey(),
    question: varchar("question", { length: 1024 }).notNull(),
    answer: varchar("answer", { length: 1024 }),
    description: varchar("description", { length: 2048 }),
    internalNote: varchar("internal_note", { length: 1024 }),
    score: float("score").notNull(),
    kind: mysqlEnum("kind", quizKindEnumValues).default(QuizKind.normal),
    status: mysqlEnum("status", quizStatusEnumValues).notNull(),
    groupId: int("group_id").notNull(),
    sortOrder: int("sort_order"),
});
