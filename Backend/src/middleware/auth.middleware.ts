import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
    };
}

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        (req as AuthenticatedRequest).user = {
            userId: decoded.userId
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;