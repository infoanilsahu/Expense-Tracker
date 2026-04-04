import { db } from "@/db/db";
import {  usersSchema, verificationSchema } from "@/db/schema"
import { and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { userData } from "@/validation/usersData";
import { sendMail } from "@/utils/mailer";
import { generateSecureOTP } from "@/utils/otp";
import bcrypt from "bcryptjs";




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
        
        const { email,username, password, name } = result.data
    
        const existUser = await db.select().from( usersSchema).where(or(
            eq( usersSchema.email, email),
            eq( usersSchema.username, username)
        ))
        if( existUser.length > 0 ) {
            return NextResponse.json({success: false, message: "email 0r username already exists"}, {status: 400})
        }

        const otp = generateSecureOTP()

        const mail = await sendMail({
            to: email,
            subject: "Email verification for Expense tracker",
            html: `<h2>Your OTP is: ${otp}</h2>`
        })

        // password hash
        const hashPassword = await bcrypt.hash(password, 10)

        const hashOTP = await bcrypt.hash(otp, 10)
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

        // store in data base

        const verificationData = await db.select().from(verificationSchema)
        .where(
            eq(verificationSchema.email, email),
        )

        if( verificationData.length > 0 ) {
            await db.update(verificationSchema)
                .set({
                    otp: hashOTP,
                    name: name,
                    otpExpiry: otpExpiry,
                    password: password,
                    username: username
                }).where(and(
                    eq(verificationSchema.email, email),
                ))
        }
        else {
            await db.insert(verificationSchema).values({
                email,
                username,
                name, 
                password: hashPassword,
                otp: hashOTP, 
                otpExpiry
            })
        }
        
        return NextResponse.json({
            success: true,
            message: "email send succucessfully"
        }, {status: 200})
    
        
    } catch (err: any) {
        console.error(err.message)
        return NextResponse.json({
            success: false,
            message: "Failed to register user"
        }, {status: 500})
    }


}