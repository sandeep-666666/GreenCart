import jwt from "jsonwebtoken";
import "dotenv/config";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("cookies:", token);
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Not authorised",
    });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token :", tokenDecode);
    if (tokenDecode.id) {
      req.body = req.body || {};
      req.body.userId = tokenDecode.id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorised",
      });
    }
    next();
  } catch (error) {
    console.log("Error occured while matching the token", error.message);
    return res.status(400).json({
      success: false,
      message: "Token value doesn't match because here is the issue",
    });
  }
};

export default authUser;
