import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";

const createUser = async (payload: Partial<IUser>)=>{
    const {  email, ...rest } = payload
    const isuserExixst = await User.findOne({email})

    if(isuserExixst){
        throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist")
    }
    const authProvider : IAuthProvider = { provider: "credentials", providerId: email as string}

    const user = await User.create({ 
        email, 
        auths: [authProvider],
        ...rest})

    return user
};
const getAllUsers = async()=>{
    const users = await User.find()
    const totatUser = await User.countDocuments()

    return {
        date: users,
        meta:{
            total: totatUser
        }
    }
}

export const UserService ={
    createUser,
    getAllUsers
}