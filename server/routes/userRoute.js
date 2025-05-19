import express from "express";
import {
  register,
  login,
  logOut,
  isAuth,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logOut);

export default userRouter;
