import User from "../models/User.js";

//update user cart date : api/cart/update

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    if (!userId || !cartItems) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    await User.findByIdAndUpdate(userId, { cartItems });
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.log("Error occured while updating cart data", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart please try again later",
    });
  }
};
