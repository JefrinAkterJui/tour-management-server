import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No token recived");
        }

        const veryfiedToken = verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

        const isUserExist = await User.findOne({email: veryfiedToken.email});

        if(!isUserExist){
            throw new AppError(StatusCodes.BAD_REQUEST , "User dose not exist")
        }
        if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
            throw new AppError(StatusCodes.BAD_REQUEST , `User is ${isUserExist.isActive}`)
        };
        if(isUserExist.isDelete){
            throw new AppError(StatusCodes.BAD_REQUEST , " User is deleted")
        }

        if (!authRoles.includes((veryfiedToken.role as string))) {
            throw new AppError(403, "You are not permitted to view this route!!");
        }
        req.user=veryfiedToken
        next();

    } catch (error) {
        next(error);
    }
};