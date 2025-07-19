/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Router } from "express";
import { UseControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router= Router()



router.post('/register', validateRequest(createUserZodSchema), UseControllers.createUser)
router.get('/', UseControllers.getAllUsers)

export const UserRoutes = router