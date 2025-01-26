import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  const option = {
    httpOnly: true, //prevent xss attacks
    secure: process.env.NODE_ENV !== "DEVELOPMENT",
    sameSite: "strict", //Csrf attacks
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res.cookie("jwt", token, option);

  return token;
};
