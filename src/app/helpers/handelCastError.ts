/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/error.types"

export const handelCastError = (error: mongoose.Error.CastError): TGenericErrorResponse =>{
    return{
        StatusCodes : 400,
        message : "Invalid MongoDB ObjectId , Please provide a valid Id"
    }
}