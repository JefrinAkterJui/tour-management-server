/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { authService } from "./auth.service"
import AppError from "../../errorHelper/AppError"
import { setAuthCookeis } from "../../utils/setCookeis"

const creadentialLogin = catchsync(async (req: Request, res: Response, next: NextFunction)=>{
        const loginInfo = await authService.creadentialLogin(req.body)

        setAuthCookeis(res, loginInfo)
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

        setAuthCookeis(res, tokenInfo);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "New Access Token Retrive Successfully",
            data: tokenInfo
        })
})
const logout = catchsync(async (req: Request, res: Response, next: NextFunction)=>{
        res.clearCookie("accessToken",{
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        })
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "User Log out Successfully",
            data: null
        })
})
const resetPassword = catchsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await authService.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})


export const authControllers ={
    creadentialLogin,
    getNewAccessToken,
    logout,
    resetPassword
}