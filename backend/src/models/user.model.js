import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true,"Full name is required"],
    },
    username:{
      type:String,
      required:[true,"Username is required"],
      unique:true,
    },
    email: {
      type: String,
      required: [true,"email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true,"password is required"],
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


export const User = mongoose.model("User",userSchema)