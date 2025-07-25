import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router()

router.post('/login', authControllers.creadentialLogin )
router.post('/refresh-token', authControllers.getNewAccessToken )
router.post('/logout', authControllers.logout )

export const AuthRoute = router