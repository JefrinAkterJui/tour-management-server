import { Response } from "express";

export interface AuthTokens{
    accessToken?: string,
    refreshToken?:string
}
export const setAuthCookeis = (res: Response, tokenInfo: AuthTokens )=>{
    if(tokenInfo.accessToken){
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true
        })
    }
    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true
        })
    }
}