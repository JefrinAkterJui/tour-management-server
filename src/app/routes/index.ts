import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoute } from "../modules/auth/auth.routes";
import { DivisionsRoutes } from "../modules/divission/division.routes";
import { TourRoutes } from "../modules/tour/tour.routes";

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
    }
];

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})
