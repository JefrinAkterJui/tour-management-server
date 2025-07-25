/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { genaretToken, verifyToken } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const creadentialLogin = async (paylode: Partial<IUser>)=>{
    if (!paylode) {
        throw new AppError(StatusCodes.BAD_REQUEST, "No data provided in request body");
    }
    console.log(paylode.email)
    const { email , password } = paylode;
    const isUserExist = await User.findOne({email});

    if(!isUserExist){
        throw new AppError(StatusCodes.BAD_REQUEST , " Email dose not exist ")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string , isUserExist.password as string)

    if(!isPasswordMatched){
        throw new AppError(StatusCodes.BAD_REQUEST , " Incorrect Password")
    }

    const userTokens = createUserTokens(isUserExist)


    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const {password: pass , ...rest}= isUserExist.toObject()
    return{
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}
const getNewAccessToken = async (refreshToken:string)=>{
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
    return{
        accessToken,
    }
}
export const authService ={
    creadentialLogin,
    getNewAccessToken
}