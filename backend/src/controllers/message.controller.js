import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../app.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

//get user for side bar in chat app
const getUserForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserID = req.user._id;
  const filterdUser = await User.find({
    _id: { $ne: loggedInUserID },
  }).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, filterdUser, "user fetched successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatID } = req.params;
  const myID = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderID: userToChatID, reciverID: myID },
      { senderID: myID, reciverID: userToChatID },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "messages fetched successfully"));
});

const sendMessages = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const messageImgLocalPath = req.file?.path;
  const { id: receiverID } = req.params;
  const senderID = req.user._id;
  
  let imageUrl = "";
  if (messageImgLocalPath) {
    const uploadResponse = await uplodeOnCloudinary(messageImgLocalPath);
    imageUrl = uploadResponse?.secure_url || "";
  }

  const receiverIdToObject = mongoose.Types.ObjectId.isValid(receiverID)
    ? new mongoose.Types.ObjectId(receiverID)
    : null;

  if (!receiverIdToObject) {
    throw new ApiError(400,"Invalid receiverID");
  }

  const newMessage = await Message.create({
    senderID,
    reciverID: receiverIdToObject,
    text,
    image: imageUrl,
  });

  //realTime functionality => socket.io

  const receiverSocketId = getReceiverSocketId(receiverID);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit(
      "newMessage",
      newMessage
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newMessage, "new message created"));
});

export { getUserForSidebar, getMessages, sendMessages };
