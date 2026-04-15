import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";



export const signup=async(req,res)=>{
   const {fullName,email,password}=req.body

   try{
    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
  

    if(password.length < 6){
        return res.status(400).json({message:"Password must be at least 6 characters"})
    }

    //check if emails valid:regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser=await User.findOne({email:email});
    if(existingUser) {
        return res.status(400).json({message:"Email already exist"})
    }
 

    //123456 => $dsf4jn4!@#234r#$234
    const salt=await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new User({
        fullName,
        email,
        password:hashedPassword
    })

    if(newUser){
        const savedUser=await newUser.save()
        generateToken(savedUser._id,res)

       

        //todo:send a welcome email to user
        try{
            await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL);
        }catch(error){
            console.error("failed to send welcome email:",error);
        }
        res.status(201).json({
            _id:savedUser._id,
            fullName:savedUser.fullName,
            email:savedUser.email,
            profilePic:savedUser.profilePic,
    });
}else{
        res.status(400).json({message:"Invalid user data"})
    }
}catch(error){
    console.log("Error in singup controller:",error)
    res.status(500).json({message:"Internal server error"});
    }
};

export const login=async(req,res)=>{
    
    const{email,password}=req.body

    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"});
    }

    try{
        const existingUser=await User.findOne({email:email})
        if(!existingUser) return res.status(400).json({
            message:"Invalid Credentials" }) //nvr tell the client which one is incorrect:password or email

            const isPasswordCorrect=await bcrypt.compare(password,existingUser.password)
            if(!isPasswordCorrect) return res.status(400).json({
                message:"Invalid Credentials"
            });
            
            generateToken(existingUser._id,res)
            res.status(200).json({
                _id:existingUser._id,
                fullName:existingUser.fullName,
                email:existingUser.email,
                profilePic:existingUser.profilePic,
            });
        }catch(error){
        console.error("Error in login controller:",error)
        res.status(500).json({message:"Internal server error"});
    }
};



export const logout=(_,res)=>{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({ message:"Logged out succesfully"});
};


export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        if(!profilePic) return res.status(400).json({message:"Profile pic is required"})

        const userId = req.user._id;

        const uploadResponse=await cloudinary.uploader.upload(profilePic)

        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},{new:true}
        );

        res.status(200).json(updatedUser)    

 }catch(error){
    console.log("Error in update profile:",error);
    res.status(500).json({message:"Internal server error"});
    }
};