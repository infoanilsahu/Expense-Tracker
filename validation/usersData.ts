import { z } from "zod"

export const userData = z.object({
    name: z.string().min(3, {error: "invalid name "}),
    username: z.string().min(3, {error: "invaid username "}),
    email: z.string().email({error: "email is required"}),
    password: z.string()
            .min(6, "Must contain 6 digit")
            .regex(/[A-Z]/, "Must contain Uppercase letter")
            .regex(/[a-z]/, "Must contain lower letter")
            .regex(/[0-9]/, "Must contain a number ")
})

export const loginSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3, {error: "invalid username"}).optional(),
    password: z.string().min(3)
}).refine((data) => data.email || data.username, {
    message: "Email or username is required",
    path: ["email"]
})

