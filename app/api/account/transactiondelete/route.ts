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

        const { transcationId } = json

        const token = await TokenData(req)
        
        const parseToken = decodedToken.safeParse(token)
        if (!parseToken.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 400 });
        }

        const { id } = parseToken.data

        const transArr = await db.select().from(transcationsSchema).where(
            eq(transcationsSchema.id, transcationId)
        )
        if( transArr.length === 0 ) {
            return NextResponse.json({
                success: false,
                message: "transaction id not found"
            }, {status: 400})
        }

        const trans = transArr[0]

        if( trans.userId !== id ) {
            return NextResponse.json({
                success: false,
                message: "Invalid transaction id"
            }, {status: 400})
        }

        await db.delete(transcationsSchema).where(
            eq(transcationsSchema.id, transcationId)
        )        

        return NextResponse.json({
            success: true,
            message: "Transaction deleted successfully"
        }, { status: 200 })
    

    } catch (err: any) {
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: "Failed to transaction delete"
        }, {status: 500})
    }
    
}