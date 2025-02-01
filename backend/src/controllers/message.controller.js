import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";

//get user for side bar in chat app
const getUserForSidebar = asyncHandler(async (req, res) => {
  try {
    const loggedInUserID = req.user._id;

    const filterdUser = await User.find({
      _id: { $ne: loggedInUserID },
    }).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, filterdUser, "user fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error in fetching user for sidebar");
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new ApiError(500, "unable to fetch messages");
  }
});

const sendMessages = asyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverID } = req.params;
    const senderID = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await uplodeOnCloudinary(image);
      imageUrl = uploadResponse?.secure_url || "";
    }

    const newMessage = await Message.create({
      senderID,
      reciverID,
      text,
      image: imageUrl,
    });

    //realTime functionality => socket.io

    return res
      .status(200)
      .json(new ApiResponse(200, newMessage, "new message created"));
  } catch (error) {
    throw new ApiError(500,"Error in send message controller");
  }
});

export { getUserForSidebar, getMessages, sendMessages };
