import { IUser } from "../modules/user/user.interface";
import { genaretToken } from "./jwt";

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
}