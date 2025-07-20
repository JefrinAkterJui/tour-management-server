/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { authService } from "./auth.service"

const creadentialLogin = catchsync(async (req: Request, res: Response, next: NextFunction)=>{
    console.log("Request Body:", req.body)
        const loginInfo = await authService.creadentialLogin(req.body)
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User Logged In Successfully",
            data: loginInfo
        })
})


export const authControllers ={
    creadentialLogin
}