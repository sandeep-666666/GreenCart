import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    cartItems: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model("user", UserSchema);

export default User;
