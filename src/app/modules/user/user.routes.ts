import { Router } from "express";
import { UseControllers } from "./user.controller";

const router= Router()

router.post('/register', UseControllers.createUser)

export const UserRoutes = router