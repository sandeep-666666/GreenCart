import "dotenv/config";
import jwt from "jsonwebtoken";
//seller login controller : /api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // console.log(process.env.SELLER_EMAIL);
    // console.log(process.env.SELLER_PASSWORD);
    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        success: true,
        message: "seller Logged in successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log("Error occured while seller login", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to login seller please try again later",
    });
  }
};

//seller authentication : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.log("Error occured while validating seller", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to varify seller please try again later",
    });
  }
};

//seller logOut : /api/seller/logout
export const sellerLogOut = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
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
