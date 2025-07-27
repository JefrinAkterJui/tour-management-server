/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { authService } from "./auth.service"
import AppError from "../../errorHelper/AppError"
import { setAuthCookeis } from "../../utils/setCookeis"
import { createUserTokens } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import passport from "passport"

const creadentialLogin = catchsync(async (req: Request, res: Response, next: NextFunction)=>{
        // const loginInfo = await authService.creadentialLogin(req.body)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passport.authenticate("local", async (error: any, user: any, info: any)=>{
            if(error){
                return next(new AppError(401, error))
            }
            if(!user){
                return next(new AppError(401, info.message))
            }
            
            const userToken = await createUserTokens(user)
            const {password: pass, ...rest} = user.toObject()

            setAuthCookeis(res, userToken)
            sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: "User Logged In Successfully",
                data: rest
            })
        })(req, res, next)
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

    await authService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})
const googleCallbackController = catchsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state? req.query.state as string : ""
    if(redirectTo.startsWith("/")){
        redirectTo= redirectTo.slice(1)
    }

    const user = req.user
    console.log("User", user)
    if(!user){
        throw new AppError(StatusCodes.NOT_FOUND, "User Not Found")
    }
    const tokenInfo = createUserTokens(user)

    setAuthCookeis(res, tokenInfo)
    res.redirect(`${process.env.FRONTEND_URL as string}/${redirectTo}`)
})


export const authControllers ={
    creadentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}