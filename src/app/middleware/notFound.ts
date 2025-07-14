import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const NotFount = (req: Request, res: Response)=>{
    res.status(StatusCodes.NOT_FOUND).json({
        success:false,
        message: "Route Not Found"
    })
}
export default NotFount;