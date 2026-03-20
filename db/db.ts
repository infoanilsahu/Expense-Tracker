import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from "pg";

if(!process.env.DATABASE_URL) {
    throw new Error(" data base url not found")
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool)