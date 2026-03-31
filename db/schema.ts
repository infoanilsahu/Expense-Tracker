import { pgTable, integer, varchar, decimal, pgEnum, timestamp, unique } from "drizzle-orm/pg-core";

export const paymentTypeEnum = pgEnum("payment_type", ["cash", "online"]);
export const groupRol = pgEnum("group_role", ["admin", "member"])

export const usersSchema = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    name: varchar().notNull(),
    username: varchar().unique().notNull(),
    password: varchar().notNull()
}) 


export const transcationsSchema = pgTable("transactions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    message: varchar(),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    type: paymentTypeEnum().notNull().default("cash"),
    time: timestamp().defaultNow().notNull(),

    userId: integer().notNull().references(() => usersSchema.id),
    groupId: integer().notNull().references(() => groupsSchema.id),
})

export const groupsSchema = pgTable("groups", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    description: varchar(),
})

export const groupMemberSchema = pgTable("group_member", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    role: groupRol().default("member"),

    userId: integer().notNull().references(() => usersSchema.id),

    groupId: integer().notNull().references(() => groupsSchema.id),
}, (column) => [
    unique().on(column.userId, column.groupId)
])

export const groupTransactionSchema = pgTable("group_transaction", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar().notNull(),
    message: varchar(),
    amount: decimal({ precision: 10, scale: 2 }).notNull(),
    type: paymentTypeEnum().notNull().default("cash"),
    time: timestamp().defaultNow().notNull(),

    userId: integer().notNull().references(() => usersSchema.id),
    groupId: integer().notNull().references(() => groupsSchema.id)
})


export const verificationSchema = pgTable("email_verification", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().unique().notNull(),
    name: varchar().notNull(),
    username: varchar().unique().notNull(),
    password: varchar().notNull(),
    otp: varchar().notNull(),
    otpExpiry: timestamp("otp_expiry").notNull(),
})

