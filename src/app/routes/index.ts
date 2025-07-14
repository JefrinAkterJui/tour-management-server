import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";

export const router= Router()

export const moduleRoutes = [
    {
        path:"/user",
        route: UserRoutes
    }
];

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})
