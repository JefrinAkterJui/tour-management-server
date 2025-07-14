import {model, Schema} from "mongoose"
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface"

const authProviderSchema = new Schema<IAuthProvider>({
    provider:{type: String , required: true},
    providerId:{type: String, required:true}
},{
    _id: false,
    versionKey: false
})

const userSchema = new Schema<IUser>({
    name:{type: String , required: true},
    email:{type: String, required: true, unique:true},
    password:{type:String},
    role:{
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    phone:{type: String},
    picture:{type:String},
    address:{type: String},
    isDelete:{type: Boolean, default: false},
    isActive:{
        type: Boolean,
        default: true
    },
    isVerified:{type:Boolean, default:false},
    auths:[authProviderSchema]
},{
    timestamps:true,
    versionKey:false
})

export const User = model<IUser>("User", userSchema)