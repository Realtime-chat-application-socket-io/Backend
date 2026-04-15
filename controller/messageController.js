import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // Get all users except current user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getContacts: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChats = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // For now, return all contacts as chats. Can be filtered further if needed.
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getChats: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    
    if(!text && !image) {
      return res.status(400).json({ error: "Message must contain text or image" });
    }

    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    // Socket.io real-time logic
    const receiverSocketIds = getReceiverSocketId(receiverId);
    if (receiverSocketIds && receiverSocketIds.length > 0) {
      io.to(receiverSocketIds).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};