import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Wishlist = () => {
  const {
    products,
    wishlistItems,
    removeFromWishlist,
    addToCart,
    navigate,
    currency,
  } = useAppContext();

  const [wishlistArray, setWishlistArray] = useState([]);

  const getWishlist = () => {
    let tempArray = [];
    for (const key in wishlistItems) {
      const product = products.find((item) => item._id === key);
      if (product) tempArray.push(product);
    }
    setWishlistArray(tempArray);
  };

  useEffect(() => {
    if (products.length > 0 && wishlistItems) {
      getWishlist();
    }
  }, [products, wishlistItems]);

  const handleAddToCart = (product) => {
    addToCart(product._id);
    toast.success(`${product.name} added to cart`);
  };

  return products.length > 0 && wishlistItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Wishlist{" "}
          <span className="text-sm text-primary">
            {wishlistArray.length} items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Price</p>
          <p className="text-center">Actions</p>
        </div>

        {wishlistArray.length > 0 ? (
          wishlistArray.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 border-b border-gray-200 pb-3"
            >
              {/* Product Info */}
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${
                        product._id
                      }`
                    );
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                >
                  <img
                    className="max-w-full h-full object-cover"
                    src={product.image[0]}
                    alt={product.name}
                  />
                </div>
                <div>
                  <p className="hidden md:block font-semibold">
                    {product.name}
                  </p>
                  <p className="text-gray-500/70">
                    Category: {product.category}
                  </p>
                </div>
              </div>

              {/* Price */}
              <p className="text-center font-semibold">
                {currency}
                {product.offerPrice}
              </p>

              {/* Actions */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dull transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="cursor-pointer text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Your wishlist is empty 💔
          </p>
        )}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* Right Section (optional recommendation section) */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 rounded-lg">
        <h2 className="text-xl font-medium">You May Also Like</h2>
        <hr className="border-gray-300 my-5" />

        {products.slice(0, 3).map((item, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/products/${item.category.toLowerCase()}/${item._id}`)
            }
            className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
          >
            <img
              src={item.image[0]}
              alt={item.name}
              className="w-16 h-16 object-cover border border-gray-300 rounded"
            />
            <div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-gray-500 text-sm">
                {currency}
                {item.offerPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default Wishlist;
