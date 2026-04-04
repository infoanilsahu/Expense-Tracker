import z from "zod"

export const transcationsData = z.object({
    title: z.string().nonempty(),
    message: z.string().nonempty(),
    amount: z.coerce.number(),
    type: z.enum(["online", "cash"])
})