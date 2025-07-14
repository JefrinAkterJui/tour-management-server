/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelper/AppError";

export const globalErrorHandeller = (error: Error, req: Request, res: Response, next: NextFunction) => {
    let StatusCodes = 500;
    let message = `Something went eorng`

    if(error instanceof AppError){
        StatusCodes = error.statusCode
        message =error.message
    }else if(error instanceof Error){
        StatusCodes = 500;
        message = error.message
    }

    res.status(StatusCodes).json({
        success: false,
        message,
        error,
        stack: process.env.NODE_ENV === "development" ? error.stack : null
    })
}