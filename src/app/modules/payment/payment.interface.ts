/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS{
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELED = "CANCELED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export interface IPayement{
    booking: Types.ObjectId;
    transectionId: string;
    ammount: number;
    paymentGatewayData?: any;
    invoiceUrl?: string;
    status: PAYMENT_STATUS
}