import { Router } from "express";
import { UseControllers } from "./user.controller";

const router= Router()

router.post('/register', UseControllers.createUser)
router.get('/', UseControllers.getAllUsers)

export const UserRoutes = router