import { db } from "@/db/db";
import {  usersSchema } from "@/db/schema"
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { userData } from "@/validation/usersData";
import { sendMail } from "@/utils/mailer";




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
    
        const existUser = await db.select().from( usersSchema).where(or(
            eq( usersSchema.email, email),
            eq( usersSchema.username, username)
        ))
        if( existUser ) {
            return NextResponse.json({success: false, message: "email 0r username already exists"}, {status: 400})
        }

        const mail = await sendMail({
            to: email,
            subject: "Email verification for Expense tracker",
            html: "otp"
        })

        // store in data base
        // create new schema
        
        // return NextResponse.json({
        //     success: true,
        //     message: "email send succucessfully"
        // }, {status: 200})
    
        
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            message: err.message
        }, {status: 400})
    }


}