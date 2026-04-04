import { db } from "@/db/db";
import { transcationsSchema, usersSchema } from "@/db/schema";
import { TokenData } from "@/utils/tokenData";
import { transcationsData } from "@/validation/transcationData";
import { decodedToken } from "@/validation/usersData";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
        const json = await req.json()
    
        const parseData = transcationsData.safeParse(json)
        if (!parseData.success) {
            return NextResponse.json({
                success: false,
                message: parseData.error.message
            }, { status: 400 });
        }
    
        const { title, message, amount, type} = parseData.data

        const token = await TokenData(req)
        
        const parseToken = decodedToken.safeParse(token)
        if (!parseToken.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 400 });
        }

        const {id, username} = parseToken.data

        const userArr = await db.select().from(usersSchema).where(and(
            eq(usersSchema.id, id),
            eq(usersSchema.username, username)
        ))
        if( userArr.length < 1 ) {
            return NextResponse.json({
                success: false,
                message: "User not exists"
            }, {status: 404})
        }

        const user = userArr[0]

        await db.insert(transcationsSchema).values({
            title: title,
            message,
            amount: amount.toString(),
            type,
            time: new Date(),
            userId: user.id,
            groupId: null      
        })

        return NextResponse.json({
            success: true,
            message: "Transaction created successfully"
        }, { status: 201 })
    

    } catch (err: any) {
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: "Failed to create transaction"
        }, {status: 500})
    }
    
}