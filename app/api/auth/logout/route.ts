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
            }, { status: 401 });
        }
    
        const cookieStore = await cookies()
        cookieStore.delete("token")

        return NextResponse.json({
            success: true,
            message: "user succesfully logout"
        }, {status: 200})

    } catch (err:any) {
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: err.message
        }, {status: 500})
    }

}