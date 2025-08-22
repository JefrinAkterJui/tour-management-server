import { Router } from "express";
import { UseControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";

const router= Router()



router.post('/register', validateRequest(createUserZodSchema), UseControllers.createUser)
router.get('/', checkAuth(Role.ADMIN, Role.SUPERADMIN) , UseControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UseControllers.getMe)
router.get("/:id", checkAuth(...Object.values(Role)), UseControllers.getSingleUser)
router.patch('/:id', checkAuth(...Object.values(Role)), UseControllers.updatedUser)

export const UserRoutes = router