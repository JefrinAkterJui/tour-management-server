/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { authService } from "./auth.service"
import AppError from "../../errorHelper/AppError"

const creadentialLogin = catchsync(async (req: Request, res: Response, next: NextFunction)=>{
        const loginInfo = await authService.creadentialLogin(req.body)

        res.cookie("accessToken", loginInfo.accessToken, {
            httpOnly: true,
            secure: true
        })
        res.cookie("refreshToken", loginInfo.refreshToken, {
            httpOnly: true,
            secure: true
        })
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User Logged In Successfully",
            data: loginInfo
        })
});
const getNewAccessToken = catchsync(async (req: Request, res: Response, next: NextFunction)=>{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            throw new AppError(StatusCodes.BAD_REQUEST, "No refresh Token recived from cookeis")
        }
        const tokenInfo = await authService.getNewAccessToken(refreshToken)
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User Logged In Successfully",
            data: tokenInfo
        })
})


export const authControllers ={
    creadentialLogin,
    getNewAccessToken
}