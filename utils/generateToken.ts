import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtPayload {
    id: number;
    username: string;
}

export function generateToken(data: JwtPayload): string {
    const TOKEN_SECRET = process.env.TOKEN_SECRET;

    if (!TOKEN_SECRET) {
        throw new Error("TOKEN_SECRET is not defined");
    }

    const options: SignOptions = {
        expiresIn: (process.env.TOKEN_EXP || "1h") as SignOptions["expiresIn"],
    };

    return jwt.sign(data, TOKEN_SECRET, options);
}



export function verifyToken(token: string) {
    const TOKEN_SECRET = process.env.TOKEN_SECRET;

    if (!TOKEN_SECRET) {
        throw new Error("TOKEN_SECRET is not defined");
    }

    return jwt.verify(token, TOKEN_SECRET)

}

