import { pgTable, integer, varchar, decimal, pgEnum, timestamp, unique } from "drizzle-orm/pg-core";

export const paymentTypeEnum = pgEnum("payment_type", ["cash", "online"]);
export const groupRol = pgEnum("group_role", ["admin", "member"])

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    name: varchar().notNull(),
    username: varchar().unique().notNull(),
    password: varchar().notNull()
}) 


export const transactions = pgTable("transactions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    message: varchar(),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    type: paymentTypeEnum().notNull().default("cash"),
    time: timestamp().defaultNow().notNull(),

    userId: integer().notNull().references(() => users.id),
    groupId: integer().notNull().references(() => groups.id),
})

export const groups = pgTable("groups", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    description: varchar(),
})

export const groupMember = pgTable("group_member", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    role: groupRol().default("member"),

    userId: integer().notNull().references(() => users.id),

    groupId: integer().notNull().references(() => groups.id),
}, (column) => [
    unique().on(column.userId, column.groupId)
])

export const groupTransaction = pgTable("group_transaction", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    message: varchar(),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    type: paymentTypeEnum().notNull().default("cash"),
    time: timestamp().defaultNow().notNull(),

    userId: integer().notNull().references(() => users.id),
    groupId: integer().notNull().references(() => groups.id)
})

