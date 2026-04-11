import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URI);

        console.log('MongoDB Connected');
    } catch (error) {
        console.log('Error Connecting to MongDB');
        process.exit(1);
    }
}

export default connectDB;