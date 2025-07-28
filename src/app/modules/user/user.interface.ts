/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum IsActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IAuthProvider{
    provider: "google"| "credentials";
    providerId: string
}
export enum Role{
    ADMIN = "ADMIN",
    SUPERADMIN="SUPERADMIN",
    USER = "USER",
    GUID = "GUID"
}

export interface IUser{
    _id?:string;
    name: string;
    email:string;
    password?:string;
    phone?: string;
    picture?: string;
    address?: string;
    isDelete?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role?: Role;
    auths?: IAuthProvider[];
    bookings?: Types.ObjectId[];
    guids?: Types.ObjectId[];
    
}