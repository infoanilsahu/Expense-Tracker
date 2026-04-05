import { db } from "@/db/db";
import { groupMemberSchema, groupsSchema } from "@/db/schema";
import { TokenData } from "@/utils/tokenData";
import { decodedToken } from "@/validation/usersData";
import { and, eq } from "drizzle-orm";
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
        const { groupId, userId } = json

        const groupArr = await db.select().from(groupsSchema).where(
            eq(groupsSchema.id, groupId)
        )
        if( !groupArr ) {
            return NextResponse.json({
                success: false,
                message: "group not exists"
            }, {status: 400})
        }

        const group = groupArr[0]
        if( group.admin != id ) {
            return NextResponse.json({
                success: false,
                message: "only admin can add member"
            }, {status: 400})
        }

        const existsMember = await db.select().from(groupMemberSchema).where(and(
            eq(groupMemberSchema.groupId, group.id),
            eq(groupMemberSchema.userId, userId)
        ))
        if( existsMember.length > 0 ) {
            return NextResponse.json({
                success: false,
                message: "user already exists"
            }, {status: 400})
        }

        await db.insert(groupMemberSchema).values({
            groupId: groupId,
            userId: userId,
            role: "member"
        })

        return NextResponse.json({
            success: true,
            message: "user successfully add"
        }, {status: 200})


    }
    catch(err: unknown) {
        if (err instanceof Error && (err.message === "Token not found" || err.message === "Invalid token")) {
            return NextResponse.json(
                { success: false, message: err.message },
                { status: 401 }
            );
        }

        console.error(err)
        return NextResponse.json({
            success: false,
            message: "Failed to add members"
        }, {status: 500})

    }
}