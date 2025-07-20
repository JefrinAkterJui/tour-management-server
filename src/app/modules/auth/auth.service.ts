/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"

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

    return{
        email: isUserExist.email
    }
}
export const authService ={
    creadentialLogin
}