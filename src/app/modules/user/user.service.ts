import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>)=>{
    const {  email,password, ...rest } = payload
    const isuserExixst = await User.findOne({email})

    if(isuserExixst){
        throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist")
    }
    const hashPassword =await bcryptjs.hash(password  as string, 10)
    const authProvider : IAuthProvider = { provider: "credentials", providerId: email as string}

    const user = await User.create({ 
        email,
        password: hashPassword, 
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
const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload)=>{
    const isUserExist = await User.findById(userId)

    if(!isUserExist){
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUID){
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorize")
        }
        if(payload.role === Role.SUPERADMIN && decodedToken.role === Role.ADMIN){
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorize")
        }
    }
    if(payload.isActive || payload.isDelete || payload.isVerified){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUID){
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorize")
        }
    }
    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password, process.env.SUPER_ADMIN_PASS as string)
    };
    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})
    return newUpdateUser
}

export const UserService ={
    createUser,
    getAllUsers,
    updateUser
}