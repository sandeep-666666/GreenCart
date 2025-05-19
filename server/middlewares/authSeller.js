import jwt from "jsonwebtoken";
import "dotenv/config";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  if (!sellerToken) {
    return res.status(401).json({
      success: false,
      message: "Not Authorised",
    });
  }
  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorised",
      });
    }
  } catch (error) {
    console.log("Error occured while matching the token", error.message);
    return res.status(400).json({
      success: false,
      message: "Token value doesn't match",
    });
  }
};

export default authSeller;
