import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Override local DNS specifically for this process to avoid local Windows/ISP SRV block issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URI);

        console.log('MongoDB Connected');
    } catch (error) {
        console.log('Error Connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

export default connectDB;