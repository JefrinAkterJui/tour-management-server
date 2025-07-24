/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Router } from "express";
import { UseControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";

const router= Router()



router.post('/register', validateRequest(createUserZodSchema), UseControllers.createUser)
router.get('/', checkAuth(Role.ADMIN, Role.SUPERADMIN) , UseControllers.getAllUsers)
router.patch('/:id', checkAuth(...Object.values(Role)), UseControllers.updatedUser)

export const UserRoutes = router