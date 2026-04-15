import User from "../models/userModel.js"; // Model import karein
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

// 1. Create User (Signup)
export async function signup(req, res) {
    try {
        const { username, email, password } = req.body;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            user: newUser,
            token: generateToken(newUser._id)
        });

    } catch (error) {
        console.log("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// 2. User Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist"
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 3. Generate token
    const token = generateToken(user._id);

    // 5. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      email
    });

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
// 3. User Update
export async function update(req, res) {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        // Use $set to only update fields that are actually provided
        const updateData = {};
        if (username) updateData.name = username;
        if (email) updateData.email = email;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData }, 
            { new: true, runValidators: true } // runValidators ensures email format is still valid
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                email: updatedUser.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// 4. Logout
export const logout = (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.log("Logout Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};