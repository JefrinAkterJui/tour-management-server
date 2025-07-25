import { StatusCodes } from "http-status-codes";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { genaretToken, verifyToken } from "./jwt";
import AppError from "../errorHelper/AppError";
import { JwtPayload } from "jsonwebtoken";

export const createUserTokens = (user: Partial<IUser>)=>{
    const jwtPayloade ={
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = genaretToken(jwtPayloade, process.env.JWT_ACCESS_SECRET as string, process.env.JWT_ACCESS_EXPIRES as string)

    const refreshToken = genaretToken(jwtPayloade, process.env.JWT_REFRESH_SECRET as string, process.env.JWT_REFRESH_EXPIRES as string)

    return{
        accessToken,
        refreshToken,
    }
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string)=>{
    const verifyRefreshToken = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload

    const isUserExist = await User.findOne({email: verifyRefreshToken.email});

    if(!isUserExist){
        throw new AppError(StatusCodes.BAD_REQUEST , "User dose not exist")
    }
    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
        throw new AppError(StatusCodes.BAD_REQUEST , `User is ${isUserExist.isActive}`)
    };
    if(isUserExist.isDelete){
        throw new AppError(StatusCodes.BAD_REQUEST , " User is deleted")
    }

    const jwtPayloade ={
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = genaretToken(jwtPayloade, process.env.JWT_ACCESS_SECRET as string, process.env.JWT_ACCESS_EXPIRES as string);

    return accessToken;
}