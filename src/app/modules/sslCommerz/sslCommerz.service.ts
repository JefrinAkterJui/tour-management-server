import { StatusCodes } from "http-status-codes";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios"
import AppError from "../../errorHelper/AppError";

const sslPaymentInit = async (payload: ISSLCommerz) =>{
    try {
        const data = {
                store_id: process.env.SSL_STORE_ID,
                store_passwd: process.env.SSL_STORE_PASS,
                total_amount: payload.amount,
                currency: "BDT",
                tran_id: payload.transactionId,
                success_url: `${process.env.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
                fail_url: `${process.env.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
                cancel_url: `${process.env.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
                // ipn_url: envVars.SSL.SSL_IPN_URL,
                shipping_method: "N/A",
                product_name: "Tour",
                product_category: "Service",
                product_profile: "general",
                cus_name: payload.name,
                cus_email: payload.email,
                cus_add1: payload.address,
                cus_add2: "N/A",
                cus_city: "Dhaka",
                cus_state: "Dhaka",
                cus_postcode: "1000",
                cus_country: "Bangladesh",
                cus_phone: payload.phoneNumber,
                cus_fax: "01711111111",
                ship_name: "N/A",
                ship_add1: "N/A",
                ship_add2: "N/A",
                ship_city: "N/A",
                ship_state: "N/A",
                ship_postcode: 1000,
                ship_country: "N/A",
            }
            const response = await axios({
                method: "POST",
                url: process.env.SSL_PAYMENT_API,
                data: data,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            })
    
            return response.data;
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log("Payment Error Occured", error);
        throw new AppError(StatusCodes.BAD_REQUEST, error.message)
    }
};

export const SSLService = {
    sslPaymentInit
}