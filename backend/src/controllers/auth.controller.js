import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/Token.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";

//creating new user if not existed
const signup = asyncHandler(async (req, res) => {
  //getting user data
  const { fullname, email, password, username } = req.body;

  try {
    if (!fullname || !email || !password || !username) {
      throw new ApiError(400, "All fields are required");
    }

    if (
      [fullname, email, password, username].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 character" });
    }

    //geting url of dp using multer
    const dpLocalPath = req.file?.path;

    //check whether a user already exists
    const existedUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existedUser) {
      throw new ApiError(409, "user with email already exist");
    }

    //hashing of password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePic = await uplodeOnCloudinary(dpLocalPath);

    console.log(profilePic);

    //creating new user

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      profilePic: profilePic?.url || "",
    });

    if (newUser) {
      generateToken(newUser._id, res);

      return res
        .status(201)
        .json(new ApiResponse(200, newUser, "User registered Successfully"));
    } else {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }
  } catch (error) {
    throw new ApiError(500, "Error while signup user");
  }
});

//signin existing user
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!(username || email)) {
      throw new ApiError(400, "username or email is required");
    }

    if (!password) {
      throw new ApiError(400, "Password is required");
    }
    const logedInUser = await User.findOne({ $or: [{ email }, { username }] });

    if (!logedInUser) {
      throw new ApiError(400, "Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      logedInUser.password
    );

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid password");
    }

    generateToken(logedInUser._id, res);

    const user = await User.findOne({ $or: [{ email }, { username }] }).select(
      "-password"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user logged in successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while logging in:", error);
  }
});

//logout user
const logout = asyncHandler(async (req, res) => {
  try {
    return res
      .cookie("jwt", "", { maxAge: 0 })
      .json(new ApiResponse(200, {}, "user loggedout successfully"));
  } catch (error) {
    throw new ApiError(500, "error in logout controller");
  }
});

//change profile picture

const updateProfilePic = asyncHandler(async (req, res) => {
  try {
    const dpLocalPath = req.file?.path;

    if (!dpLocalPath) {
      throw new ApiError(400, "Profile Picture is missing");
    }

    const dp = await uplodeOnCloudinary(dpLocalPath);
    console.log(dp);

    if (!dp) {
      throw new ApiError(400, "Error while uploading Profile Picture");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profilePic: dp?.url,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile picture updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while updating Profile");
  }
});

//updating fullname

const updatefullname = asyncHandler(async (req, res) => {
  try {
    const { fullname } = req.body;

    if (!fullname) {
      throw new ApiError(400, "fullname is required");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullname,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "fullname updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while updating fullname");
  }
});

//change password

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new ApiError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New and Confirm passwords must be same");
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid Old Password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;

    await user.save({
      validateBeforeSave: false,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while updating password");
  }
});

//get user profile

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "current user fetched successfully"));
});

export {
  signup,
  login,
  logout,
  updateProfilePic,
  updatefullname,
  changeCurrentPassword,
  getCurrentUser,
};
