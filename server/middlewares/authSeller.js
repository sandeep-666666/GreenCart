import jwt from "jsonwebtoken";
import "dotenv/config";

const authSeller = async (req, res, next) => {
  try {
    // check if cookies exist
    if (!req.cookies) {
      return res.status(401).json({
        success: false,
        message: "No cookies found, Not Authorized",
      });
    }

    const token = req.cookies.sellerToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Seller token missing, Not Authorized",
      });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // verify email matches seller email
    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not the seller",
      });
    }

    // attach decoded info to req if needed
    req.seller = decoded;

    next();
  } catch (error) {
    console.error("Error in authSeller middleware:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authSeller;
