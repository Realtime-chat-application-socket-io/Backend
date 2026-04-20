import User from "../models/userModel.js";

import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

// 1. Create User (Signup)
export async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // ✅ first save

    const token = generateToken(newUser._id, res); // ✅ then token

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      token,
    });

  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({ message: error.message }); // ✅ show real error
  }
}

// 2. User Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = generateToken(user._id, res);

    // 5. Send response
    return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        token: token,
    });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// 3. User Update (Profile)
export async function updateProfile(req, res) {
    try {
        const userId = req.user._id;
        const { profilePic, fullName } = req.body;

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (profilePic) updateData.profilePic = profilePic;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData }, 
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 4. Logout
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// 5. Check Auth
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};