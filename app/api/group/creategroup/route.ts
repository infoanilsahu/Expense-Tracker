import { db } from "@/db/db";
import { groupsSchema } from "@/db/schema";
import { TokenData } from "@/utils/tokenData";
import { groupData } from "@/validation/groupData";
import { decodedToken } from "@/validation/usersData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
    
        const user = await TokenData(req)
        const parseToken = decodedToken.safeParse(user)
        if (!parseToken.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 400 });
        }
        const { id } = parseToken.data
        
        const json = await req.json()
        const ParseData = groupData.safeParse(json)
        if( ParseData.error ) {
            return NextResponse.json({
                success: false, 
                message: ParseData.error.message
            }, {status: 400})
        }
    
    
        await db.insert(groupsSchema).values({
            name: ParseData.data.name,
            description: ParseData.data.description,
            admin: id
        })
        
        return NextResponse.json({
            success: true,
            message: "group has created successfully"
        }, {status: 200})

        
    } catch (err: any) {
        console.error(err.message)
        return NextResponse.json({
            success: false,
            message: "Failed to create group"
        }, {status: 500})
    }
}