import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

//Register user : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Details,all fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, //prevent js to access the cookie
      secure: process.env.NODE_ENV === "production", //use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict", //CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
    });

    return res.status(201).json({
      success: true,
      message: " User has successfully registered",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log("Error occured while registering user", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login user controller: .api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: " User has successfully loggedin",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log("Error occuredwhile user Login", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//check auth controller: api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    // console.log("user is :", user);
    return res.status(201).json({
      success: true,
      message: "Verification successfull",
      user,
    });
  } catch (error) {
    console.log("Error occured while verifying user", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//logout user controller :/api/user/logout

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error occured while logging out", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to log out please try again later",
    });
  }
};
