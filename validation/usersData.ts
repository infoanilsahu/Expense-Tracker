import { z } from "zod"

export const userData = z.object({
    name: z.string().min(3, "invalid name "),
    username: z.string().min(3, "invaid username "),
    email: z.string().email({message: "email is required"}),
    password: z.string()
            .min(6, "Must contain 6 digit")
            .regex(/[A-Z]/, "Must contain Uppercase letter")
            .regex(/[a-z]/, "Must contain lower letter")
            .regex(/[0-9]/, "Must contain a number ")
})

