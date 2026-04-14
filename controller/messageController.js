import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  const msg = new Message({
    senderId,
    receiverId,
    message
  });

  await msg.save();

  res.send("Message saved");
};

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  });

  res.json(messages);
};