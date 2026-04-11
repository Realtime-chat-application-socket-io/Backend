import User from "../models/userModel.js"; // Model import karein
import bcrypt from "bcrypt";

// 1. Create User (Signup)
export async function createuser(username, email, password) {
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: "User already exists" };
        }

        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save(); // Database mein save karein
        return { success: true, user: newUser };
    } catch (error) {
        console.log("Signup Error:", error);
        throw error;
    }
}

// 2. User Login
export async function userlogin(email, password) {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return "user not exist";
        }

        let isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return "email or password is not found";
        }
        
        return "user found";
    } catch (error) {
        console.log("Login Error:", error);
    }
}

// 3. User Update
export async function userupdate(id, name, email) {
    try {
        // findByIdAndUpdate MongoDB ka built-in function hai
        let updatedUser = await User.findByIdAndUpdate(
            id, 
            { name, email }, 
            { new: true } // updated document return karne ke liye
        );

        if (!updatedUser) return "user not found";
        
        return { name: updatedUser.name, email: updatedUser.email };
    } catch (error) {
        console.log("user update error", error);
        return null;
    }
}