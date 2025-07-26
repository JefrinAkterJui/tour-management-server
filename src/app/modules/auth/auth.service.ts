/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
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
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return{
        accessToken: newAccessToken
    }
}
const resetPassword = async ( olPassword: string, newPassword: string, decodedToken: JwtPayload )=>{
    const user = await User.findById(decodedToken.userId)

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
    }
    const isOlsPasswoedMatch = await bcryptjs.compare(olPassword, user!.password as string)
    if(!isOlsPasswoedMatch){
        throw new AppError(StatusCodes.UNAUTHORIZED, "Old password does not match")
    }
    user!.password = await bcryptjs.hash(newPassword , Number(process.env.BCRYPT_SALT_ROUND))

    user!.save()
}


export const authService ={
    creadentialLogin,
    getNewAccessToken,
    resetPassword
}