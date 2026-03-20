import { pgTable, primaryKey, integer, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    name: varchar().notNull()
}) 