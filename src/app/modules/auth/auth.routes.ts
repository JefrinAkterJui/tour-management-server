import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router()

router.post('/login', authControllers.creadentialLogin )
router.post('/refresh-token', authControllers.getNewAccessToken )
router.post('/logout', authControllers.logout )
router.post('/reset-password', checkAuth(...Object.values(Role)), authControllers.resetPassword )
router.get('/google', async(req:Request, res:Response, next: NextFunction)=>{
    const redirect = req.query.redirect || '/'
    passport.authenticate("google", {scope:["profile", "email"], state: redirect as string})(req,res, next)
})
router.get('/google/callback', passport.authenticate("google", { failureRedirect:'/login'}), authControllers.googleCallbackController)

export const AuthRoute = router