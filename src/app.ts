import express, { Application, Request, Response } from "express";
import { connectDB } from "./app/config/db";
import cors from "cors"
import { router } from "./app/routes";

connectDB()
const app : Application = express()
app.use(express.json())
app.use(cors())
app.use("/api/v1", router)

app.get('/', (req: Request, res: Response, )=>{
    res.send("Wellcome to Toure Management Server")
})

export default app;