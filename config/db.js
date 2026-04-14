import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URI);

        console.log('MongoDB Connected');
    } catch (error) {
        console.log('Error Connecting to MongoDB');
        process.exit(1);
    }
}

export default connectDB;