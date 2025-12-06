import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";
import wishlistRouter from "./routes/wishListRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://green-cart-5334.vercel.app", // your frontend
  "https://green-cart-zeta-nine.vercel.app", // your backend (required)
];

// 🔥 CORS MUST COME FIRST (before routes and before Stripe)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Stripe webhook MUST be raw body, so put it AFTER CORS
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

await connectDB();
await connectCloudinary();

app.get("/", (req, res) => {
  res.send("API is working");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`app is listening on port no http://localhost:${port}`);
});
