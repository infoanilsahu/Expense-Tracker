import { object, string } from "zod";

export const groupData = object({
    name: string().nonempty(),
    description: string(),
})