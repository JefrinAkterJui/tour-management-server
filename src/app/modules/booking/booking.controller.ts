import { JwtPayload } from "jsonwebtoken";
import { catchsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const createBooking = catchsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodeToken.userId);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});

export const BookingController ={
    createBooking
}