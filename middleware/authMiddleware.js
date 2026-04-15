import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv"
dotenv.config()

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifyToken middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};