
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./generateToken";
import { JwtPayload } from "jsonwebtoken";

export async function TokenData(req: NextRequest): Promise<JwtPayload> {
    try {
        const token = req.cookies.get("token")?.value;
    
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Token not found"
            }, {status: 404})
        }
    
        const decoded = verifyToken(token);
    
        if (typeof decoded === "string") {
            throw new Error("Invalid token");
        }
    
        return decoded;
        
    } catch (err: any) {
        console.log(err.message);
        throw new Error(err.message)
    }
}