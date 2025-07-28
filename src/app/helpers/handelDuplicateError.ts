/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types"

export const handelDuplicateError = (error: any): TGenericErrorResponse =>{
    const duplicate = error.message.match(/"([^"]*)"/)
    return{
        StatusCodes : 400,
        message : `${duplicate?.[1]} already exist`
    }
}