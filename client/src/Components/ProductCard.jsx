import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    navigate,
  } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product._id}`
          );
          scrollTo(0, 0);
        }}
        className="relative border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-40 max-w-56 w-full hover:shadow-lg transition"
      >
        {/* Wishlist Icon */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (wishlistItems[product._id]) {
              removeFromWishlist(product._id);
            } else {
              addToWishlist(product._id);
            }
          }}
          className="absolute top-2 right-2 cursor-pointer z-10"
        >
          {wishlistItems[product._id] ? (
            <AiFillHeart className="text-red-500 w-6 h-6 hover:scale-110 transition-transform" />
          ) : (
            <AiOutlineHeart className="text-gray-500 w-6 h-6 hover:text-red-400 hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Product Image */}
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition max-w-26 md:max-w-36"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>

          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:w-3.5 w-3"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                />
              ))}
            <p>4</p>
          </div>

          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-primary">
              {currency} {product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency} {product.price}
              </span>
            </p>

            {/* Cart Buttons */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-primary"
            >
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart-icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
