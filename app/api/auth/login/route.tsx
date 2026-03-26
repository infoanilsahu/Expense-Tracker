import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/validation/usersData";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
    
        const result = loginSchema.safeParse(json)
        if ( !result.success ) {
            return NextResponse.json({
                success: false,
                error: result.error.format()
            }, {status: 400})
        }
    
        const { email, username, password } = result.data
    
        const res = await db.select().from(users).where(
            or(
                email ? eq(users.email, email) : undefined,
                username ? eq(users.username, username) : undefined
            )
        )
        const user = res[0]
        if( !user ) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {status: 404})
        }
    
        const isMatch = await bcrypt.compare(password, user.password)
        if( !isMatch ) {
            return NextResponse.json({success: false, message: "Invalid credential"}, {status: 401})
        }
    
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }

}