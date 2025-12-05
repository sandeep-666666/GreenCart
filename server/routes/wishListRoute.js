import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";
import authUser from "../middlewares/authUser.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.delete("/remove", authUser, removeFromWishlist);
wishlistRouter.get("/", authUser, getWishlist);

export default wishlistRouter;
