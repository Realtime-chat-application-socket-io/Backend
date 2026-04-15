import mongoose from "mongoose";
import {ENV} from "./env.js"

export const connectDB=async()=>{
    try{
        const {MONGO_URL}=ENV;
        if(!MONGO_URL) throw new Error("MONGO_URI is not set");

        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log("MONGODB connected:",conn.connection.host)
    }catch(error){
        console.error("Error connection to mongoDB:",error)
        process.exit(1);// 1 status code means fail,0 means success
        
    }
}