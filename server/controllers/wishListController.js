import User from "../models/User.js";
import Product from "../models/Product.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);

    // Already in wishlist?
    if (user.wishlist.includes(productId)) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(userId);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("wishlist");

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};
