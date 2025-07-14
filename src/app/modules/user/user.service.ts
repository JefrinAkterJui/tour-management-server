import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>)=>{
    const { name, email } = payload
    const user = await User.create({name, email})

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