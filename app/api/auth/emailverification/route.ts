import { db } from "@/db/db";
import { usersSchema, verificationSchema } from "@/db/schema";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
    
        const { email, username, otp } = json
    
        const userData = await db.select().from(verificationSchema).where(and(
            eq(verificationSchema.email, email),
            eq(verificationSchema.username, username)
        ))
        if( userData.length == 0 ) {
            throw new Error("user not register for email verification")
        }

        const user = userData[0]

        const verification = await bcrypt.compare(otp, user.otp) 
        if( !verification ) {
            return NextResponse.json({
                success: false,
                message: "incorrect otp"
            }, {status: 400})
        }
        else if( !user.otpExpiry || user.otpExpiry.getTime() <  Date.now() ) {
            return NextResponse.json({
                success: false,
                message: "otp is expired "
            }, {status: 400})
        }

        await db.insert(usersSchema).values({
            email: user.email,
            name: user.name,
            password: user.password,
            username: user.username
        })

        await db.delete(verificationSchema).where(and(
            eq(verificationSchema.email, email),
            eq(verificationSchema.username, username)
        ))

        return NextResponse.json({
            success: true,
            message: "user successfully register"
        }, {status: 200})
        

    } catch (err: any) {
        console.error(err.message)
        return NextResponse.json({
            success: false,
            message: "Failed to emailverification"
        }, {status: 500})
    }
}