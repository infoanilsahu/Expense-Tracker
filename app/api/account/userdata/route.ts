import { db } from "@/db/db";
import { usersSchema, transcationsSchema } from "@/db/schema";
import { TokenData } from "@/utils/tokenData";
import { decodedToken } from "@/validation/usersData";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
   try {

    const user = await TokenData(req)

    const parseData = decodedToken.safeParse(user)

    if (!parseData.success) {
        return NextResponse.json({
            success: false,
            message: "Invalid token"
        }, { status: 400 });
    }

    const UsersRes = await db.select().from(usersSchema).where(eq(usersSchema.id, parseData.data.id))
    const existUser = UsersRes[0]
    if( !existUser ) {
        return NextResponse.json({
            success: false,
            message: "User not found"
        }, { status: 404 });
    }

    const transcation = await db.select().from(transcationsSchema)
                                .where(eq(transcationsSchema.userId, existUser.id))
    
    const totalExpense = transcation.reduce((sum, tran) => {
        return sum += Number(tran.amount)
    },0);

    
    return NextResponse.json({
        success: true,
        message: "user transcation",
        user: {
            id: existUser.id,
            username: existUser.username,
            name: existUser.name,
            email: existUser.email
        },
        transcation: transcation,
        totalExpense: totalExpense
    }, {status: 200})

     
   } catch (err: any) {
    console.error(err.message)
    return NextResponse.json({
        success: false,
        message: "Failed to fetch user data"
    }, {status: 500})
   }
}