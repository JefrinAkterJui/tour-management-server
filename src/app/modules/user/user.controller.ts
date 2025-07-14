import { Request, Response } from "express";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response)=>{
    try {
        const {name, email} = req.body;
        const user = await User.create({name, email})
        res.status(StatusCodes.CREATED).json({
            message:"User Created Successfully",
            user
        })
    } catch (error: any) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `Something went worng creating the user... ${error.message}`
        })
    }

};
const getAllUsers = async (req: Request, res: Response)=>{
    try {
        const users = await User.find({});
        if(!users || users.length===1){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "No Users found!"
            })
        } 
        res.status(StatusCodes.OK).json({
            message: 'Users retrieved successfully!',
            data: users,
        });
        
    } catch (error: any) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({
            message: `Something went wrong while fetching Users ....${error.message}`
        })
    }
};
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