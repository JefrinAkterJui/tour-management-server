import express, { Application, Request, Response } from "express";
import { connectDB } from "./app/config/db";
import cors from "cors"
import { router } from "./app/routes";
import { globalErrorHandeller } from "./app/middleware/globalErrorHandeller";
import NotFount from "./app/middleware/notFound";
import cookieParser from "cookie-parser" 

connectDB()
const app : Application = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use("/api/v1", router)

app.get('/', (req: Request, res: Response, )=>{
    res.send("Wellcome to Toure Management Server")
})


app.use(globalErrorHandeller)
app.use(NotFount)

export default app;