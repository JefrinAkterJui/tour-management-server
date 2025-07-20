/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Request, Response } from "express";
import { User } from "./user.model";
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
const getUserById = async (req: Request, res: Response)=>{
    try {
        const {id} = req.body;
        const user = await User.findById(id);
            
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'User not found!',
            });
        }
        res.status(StatusCodes.OK).json({
            message: 'User retrieved successfully!',
            data: user,
        });

    } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `Something went wrong while fetching the user.... ${error.message}`
        });
    }
};
const updateUser = async (req: Request, res: Response)=>{
    try {
        const {id} = req.params
        const updateData = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updateData,{
            new:true,
            runValidators:true
        });
        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'User not found for update!',
            });
        }
        res.status(StatusCodes.OK).json({
            message: 'User updated successfully!',
            data: updatedUser,
        });
        
    } catch (error:any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `Something went wrong while updating the user.... ${error.message}`
        });
    }
};
const deleteUser = async (req: Request, res: Response)=>{
    try {
        const { id } = req.params; 

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'User not found for deletion!',
            });
        }
        res.status(StatusCodes.OK).json({
            message: 'User deleted successfully!',
            data: deletedUser, 
        });
        
    } catch (error:any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `Something went wrong while updating the user... ${error.message}`,
        });
    }
}


export const UseControllers ={
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}

// route matching -> controller -> service -> model -> DB