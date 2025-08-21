/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { AnyZodObject } from "zod"

export const validateRequest =(zodSchema: AnyZodObject)=> async(req: Request, res: Response, next: NextFunction)=>{
    try {
        if (req.body.data) {
            try {
                req.body = JSON.parse(req.body.data);
            } catch (error) {
                throw new Error("Invalid JSON format in 'data'");
            }
        }
        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (error) {
        next(error)
    }
}