import { TokenData } from "@/utils/tokenData";
import { decodedToken } from "@/validation/usersData";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const token = await TokenData(req)
    
        const parseData = decodedToken.safeParse(token)
        if (!parseData.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 400 });
        }
    
        const cookieStore = await cookies()
        cookieStore.delete("token")

        return NextResponse.json({
            success: true,
            message: "user succesfully logout"
        }, {status: 200})

    } catch (err:any) {
        console.error(err.message);
        return NextResponse.json({
            success: false,
            message: "Failed to logout"
        }, {status: 500})
    }

}