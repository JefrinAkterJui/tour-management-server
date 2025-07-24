import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No token recived");
        }

        const veryfiedToken = verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

        if (!authRoles.includes((veryfiedToken.role as string))) {
            throw new AppError(403, "You are not permitted to view this route!!");
        }
        req.user=veryfiedToken
        next();

    } catch (error) {
        next(error);
    }
};