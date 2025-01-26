import mongoose, { Schema } from "mongoose";

const messageScheam = new Schema({
  senderID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reciverID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
},{timestamps:true});

export const Message = mongoose.model("Message",messageScheam);
