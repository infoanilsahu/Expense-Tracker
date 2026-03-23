import { pgTable, integer, varchar, decimal } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    name: varchar().notNull(),
    username: varchar().unique().notNull()
}) 


export const transactions = pgTable("Transaction", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    message: varchar(),
    amount: decimal().notNull(),

    userId: integer().notNull().references(() => users.id),
    groupId: integer().notNull().references(() => group.id),
})

export const group = pgTable("Group", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    description: varchar(),
})

export const groupMember = pgTable("Group Member", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: integer().notNull().references(() => users.id),

    groupId: integer().notNull().references(() => transactions.id),
})

