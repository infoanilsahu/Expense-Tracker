import { db } from "@/db/db";
import { users } from "@/db/schema"
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { userData } from "@/validation/usersData";




export async function POST(req:NextRequest) {

    try {
        const json = await req.json()
        
        const result = userData.safeParse(json)
    
        if( !result.success ) {
            return NextResponse.json({
                success: false,
                error: result.error.format()
            }, {status: 400})
        }
        
        const { email,username, password } = result.data
    
        const existUser = await db.select().from(users).where(or(
            eq(users.email, email),
            eq(users.username, username)
        ))
        if( existUser ) {
            return NextResponse.json({success: false, message: "email 0r username already exists"}, {status: 400})
        }
    
        
    } catch (error: any) {
        
    }


}