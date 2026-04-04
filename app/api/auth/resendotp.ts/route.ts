import { db } from "@/db/db";
import { verificationSchema } from "@/db/schema";
import { generateSecureOTP } from "@/utils/otp";
import { resendOTP } from "@/validation/usersData";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
    
        const parseData = resendOTP.safeParse(json)
        if(parseData.error) {
            return NextResponse.json({
                success: false,
                message: parseData.error.message
            }, {status: 400})
        }

        const { email, username} = parseData.data

        const userArr = await db.select().from(verificationSchema).where(
            and(
                eq(verificationSchema.email, email),
                eq(verificationSchema.username, username)
            )
        )
        if( userArr.length === 0 ) {
            throw new Error("user not found")
        }

        const user = userArr[0]

        const otp = generateSecureOTP()

        const hashOTP = await bcrypt.hash(otp, 10)

        await db.update(verificationSchema)
                .set({
                    otp: hashOTP
                })
                .where(eq(verificationSchema.email, email))
    
        return NextResponse.json({
            success: true, 
            message: "message send successfully"
        }, {status: 200})

    } catch (err: any) {
        console.error(err.message)
        return NextResponse.json({
            success: false,
            message: "Failed to resend otp"
        }, {status: 500})
    }
}