import { Request, Response } from "express";
import { catchsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

const initPayment = catchsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentService.initPayment(bookingId as string)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});

const successPayment = catchsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(` ${process.env.SSL_SUCCESS_FRONTEND_URL as string}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)

    }
});

const failPayment = catchsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.failPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${process.env.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const cancelPayment = catchsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${process.env.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment
};