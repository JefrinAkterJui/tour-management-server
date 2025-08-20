/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"
import { SSLService } from "../sslCommerz/sslCommerz.service";

const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(StatusCodes.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};

const successPayment = async (query: Record<string, string>)=>{

        const session = await Booking.startSession()
        session.startTransaction()
        
        try {
            const updatedPayment = await Payment.findOneAndUpdate(
                { transactionId: query.transactionId }, 
                { status: PAYMENT_STATUS.PAID,}, 
                { new: true, runValidators: true, session: session }
            )
    
            await Booking                 
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                {new : true, runValidators: true, session}
            );
            await session.commitTransaction()
            session.endSession()
            return { success: true, message: "Payment Completed Successfully" }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
    
            throw error
        }
}

const failPayment = async (query: Record<string, string>)=>{
     const session = await Booking.startSession()
        session.startTransaction()
        
        try {
            const updatedPayment = await Payment.findOneAndUpdate(
                { transactionId: query.transactionId }, 
                { status: PAYMENT_STATUS.FAILED,}, 
                { new: true, runValidators: true, session: session }
            )
    
            await Booking                 
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                {new : true, runValidators: true, session}
            );
    
            await session.commitTransaction()
            session.endSession()
            return { success: false, message: "Payment Faield" }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
    
            throw error
        }
}

const cancelPayment = async (query: Record<string, string>)=>{
     const session = await Booking.startSession()
        session.startTransaction()
        
        try {
            const updatedPayment = await Payment.findOneAndUpdate(
                { transactionId: query.transactionId }, 
                { status: PAYMENT_STATUS.CANCELED,}, 
                { new: true, runValidators: true, session: session }
            )
    
            await Booking                 
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                {new : true, runValidators: true, session}
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");
    
            await session.commitTransaction()
            session.endSession()
            return { success: false, message: "Payment Canceled" }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
    
            throw error
        }
}

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment
};