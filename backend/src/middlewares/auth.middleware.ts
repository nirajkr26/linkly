import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../utils/jwtHelper";
import UserModel, { type IUser } from "../models/user.model";

declare global {
    namespace Express {
        interface User extends IUser { }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            isSuccess: false,
            message: 'Unauthorized: token missing',
        });
    }

    try {
        const decoded = verifyToken(token) as { id: string };
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                isSuccess: false,
                message: 'Unauthorized: user not found',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            isSuccess: false,
            message: 'Invalid token',
        });
    }
};

/**
 * Optional Auth Middleware: Attaches user if token exists, but never blocks
 */
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) return next();

    try {
        const decoded = verifyToken(token) as { id: string };
        const user = await UserModel.findById(decoded.id);
        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        // Silent fail for optional auth
        next();
    }
};