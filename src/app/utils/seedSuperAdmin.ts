/* eslint-disable no-console */
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async ()=>{
    try {
        const isSuperAdminExist = await User.findOne({email: process.env.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
            console.log("Super Admin akready exist")
            return;
        }
        const superAdminPass = process.env.SUPER_ADMIN_PASS;
        const bcryptSaltRound = process.env.BCRYPT_SALT_ROUND;
        const SproviderId = process.env.SUPER_ADMIN_EMAIL

        if (!superAdminPass || !bcryptSaltRound || !SproviderId) {
            throw new Error("SUPER_ADMIN_PASS or BCRYPT_SALT_ROUND or SUPER_ADMIN_EMAIL environment variable is not set");
        }

        const hashedPass = await bcrypt.hash(
            superAdminPass,
            Number(bcryptSaltRound)
        )
        const authProvider: IAuthProvider ={
            provider: "credentials",
            providerId: SproviderId
        }
        const paylode: IUser={
            name: "Super Admin",
            role: Role.SUPERADMIN,
            email: process.env.SUPER_ADMIN_EMAIL as string,
            password: hashedPass,
            isVerified:true,
            auths:[authProvider]
        }

        const superAdmin = await User.create(paylode)
        console.log('super Admin created sucessfully')
        console.log(superAdmin)


    } catch (error) {
        console.log(error)
    }
}