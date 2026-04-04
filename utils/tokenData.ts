
import { NextRequest } from "next/server";
import { verifyToken } from "./generateToken";
import { JwtPayload } from "jsonwebtoken";

export async function TokenData(req: NextRequest): Promise<JwtPayload> {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        throw new Error("Token not found");
    }

    const decoded = verifyToken(token);

    if (typeof decoded === "string") {
        throw new Error("Invalid token");
    }

    return decoded;
}