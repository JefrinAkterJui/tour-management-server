import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { DivisionController } from "./division.controller";
import { multerUpload } from "../../config/multerConfig";


const router = Router()

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPERADMIN),
    multerUpload.single("file"),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);
router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivisions)
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPERADMIN),
    multerUpload.single("file"),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), DivisionController.deleteDivision);

export const DivisionsRoutes = router;
