/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import { catchsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
// import AppError from "../../errorHelper/AppError";



const createUser = catchsync(async (req: Request, res: Response)=>{
        const user = await UserService.createUser(req.body)
        
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User Logged In Successfully",
            data: user
        })
})
const getAllUsers = (async(req: Request, res: Response)=>{
        const result = await UserService.getAllUsers()

        if(!result || !result.date || result.date.length === 0){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "No Users found!"
            })
        } 
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Users retrieved successfully",
            data: result.date,
            meta: result.meta
        })
})
const updatedUser = catchsync(async (req: Request, res: Response)=>{
        const userId = req.params.id;
        // const token = req.headers.authorization
        // const verifiedToken = verifyToken(token as string, process.env.JWT_ACCESS_SECRET as string) as JwtPayload
        const verifiedToken = req.user
        const payload = req.body
        const user = await UserService.updateUser(userId, payload, verifiedToken)
        
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User Updated Successfully",
            data: user
        })
})



export const UseControllers ={
    createUser,
    getAllUsers,
    updatedUser,
}

// route matching -> controller -> service -> model -> DB