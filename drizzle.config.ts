import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if(!process.env.DATABASE_URL) {
    throw new Error(" data base url not found")
}


export default defineConfig({
    out: "./drizzle",
    schema: "./db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    }
})