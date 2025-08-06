import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";


const router = express.Router();

// api/v1/booking
router.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    BookingController.createBooking
);

export const BookingRoutes = router