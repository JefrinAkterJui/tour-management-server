/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelper/AppError";
import mongoose from "mongoose";
import { handelCastError } from "../helpers/handelCastError";
import { handelDuplicateError } from "../helpers/handelDuplicateError";
import { handelZodError } from "../helpers/handelZodError";
import { handelValidationError } from "../helpers/handelValidationError";
import { TErrorSource } from "../interfaces/error.types";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";


export const globalErrorHandeller = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV === "development"){
        console.log(error)
    }

    console.log({ file: req.files });
    if (req.file) {
        await deleteImageFromCLoudinary(req.file.path)
    }

    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

        await Promise.all(imageUrls.map(url => deleteImageFromCLoudinary(url)))
    }

    let StatusCodes = 500;
    let message = `Something went eorng`
    let errorSource: TErrorSource[] = []

    if((error as any).code === 11000){
        const simplifyError = handelDuplicateError(error)
        StatusCodes = simplifyError.StatusCodes
        message = simplifyError.message
    }
    else if(error.name === "CastError"){
        const simplifyError = handelCastError(error as mongoose.Error.CastError)
        StatusCodes = simplifyError.StatusCodes
        message = simplifyError.message
    }
    else if(error.name === "ZodError"){
        const simplifyError = handelZodError(error as any)
        StatusCodes = simplifyError.StatusCodes
        message = simplifyError.message
        errorSource = simplifyError.errorSource as TErrorSource[]
    }
    else if(error.name === "ValidationError"){
        const simplifyError = handelValidationError(error as any)
        StatusCodes = simplifyError.StatusCodes
        errorSource = simplifyError.errorSource as TErrorSource[]
        message = simplifyError.message
    }
    else if(error instanceof AppError){
        StatusCodes = error.statusCode
        message =error.message
    }else if(error instanceof Error){
        StatusCodes = 500;
        message = error.message
    }

    res.status(StatusCodes).json({
        success: false,
        message,
        errorSource,
        error: process.env.NODE_ENV === "development" ? error : null,
        stack: process.env.NODE_ENV === "development" ? error.stack : null
    })
}