import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoute } from "../modules/auth/auth.routes";
import { DivisionsRoutes } from "../modules/divission/division.routes";
import { TourRoutes } from "../modules/tour/tour.routes";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";

export const router= Router()

export const moduleRoutes = [
    {
        path:"/user",
        route: UserRoutes
    },
    {
        path:'/auth',
        route: AuthRoute
    },
    {
        path:'/division',
        route: DivisionsRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    },
    {
        path: "/booking",
        route: BookingRoutes
    },{
        path:"/payment",
        route: PaymentRoutes
    }
];

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})
