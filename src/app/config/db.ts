import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv()
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tour_management_backend"

export const connectDB = async()=>{
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB using Mongoose')
}
