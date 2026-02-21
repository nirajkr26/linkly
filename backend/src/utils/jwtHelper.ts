import jwt, { type JwtPayload } from "jsonwebtoken";
import { type IUser } from "../models/user.model";

export interface MyTokenPayload extends JwtPayload {
    id: string;
    email?: string;
    provider?: string;
}

/*
 * Handles both Mongoose documents (using _id) and simple objects (using id)
 */
export const signToken = (userOrPayload: Partial<IUser> | { id: string }): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }

    // Handle both user object and simple payload {id: userId}
    const payload: MyTokenPayload = ('id' in userOrPayload && userOrPayload.id)
        ? { id: userOrPayload.id } // Simple payload from login service
        : { // Full user object (e.g., from Google auth or DB)
            id: (userOrPayload as IUser)._id?.toString() || (userOrPayload as any).id || "",
            email: (userOrPayload as Partial<IUser>).email,
            provider: (userOrPayload as Partial<IUser>).provider,
        };

    if (!payload.id) {
        throw new Error("Cannot sign token: No user ID provided");
    }

    return jwt.sign(payload, secret, {
        expiresIn: "6h",
    });
};


export const verifyToken = (token: string): MyTokenPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }

    return jwt.verify(token, secret) as MyTokenPayload;
};