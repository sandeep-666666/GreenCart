import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa6";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false); // ❤️ Wishlist toggle

  const {
    user,
    setUser,
    showUserLogin,
    setshowUserLogin,
    navigate,
    setSearchQuary,
    searchQuary,
    getCartCount,
    axios,
  } = useAppContext();

  // ✅ Logout function
  const logOut = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch product categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/product/categories");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuary.length > 0) {
      navigate("/products");
    }
  }, [searchQuary]);

  // ❤️ Handle wishlist click
  const handleWishlistClick = () => {
    setWishlistActive(true);
    navigate("/wishlist");
  };

  return (
    <nav className="flex z-10 items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 transition-all">
      {/* ✅ Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* ✅ Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 relative">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>

        {/* ✅ Product Categories Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <button className="cursor-pointer">Product Categories ▾</button>
          {showDropdown && (
            <ul className="absolute top-6 left-0 bg-white shadow-md border rounded-md w-40 py-2 text-sm">
              {categories.map((cat, index) => (
                <li
                  key={index}
                  className="px-4 py-1 hover:bg-primary/10 cursor-pointer"
                  onClick={() => {
                    navigate(`/products/${cat.toLowerCase()}`);
                    setShowDropdown(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <NavLink to="/contact">Contact</NavLink>

        {/* ✅ Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuary(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        {/* ❤️ Wishlist Icon */}
        <div
          onClick={handleWishlistClick}
          className="relative cursor-pointer transition-all duration-300"
        >
          <FaHeart
            size={22}
            className={`transition-colors duration-300 ${
              wishlistActive
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500"
            }`}
          />
        </div>

        {/* 🛒 Cart Icon */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* 👤 Login / Profile */}
        {!user ? (
          <button
            onClick={() => setshowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group w-24">
            <img src={assets.profile_icon} alt="profile" className="w-10" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logOut}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Log Out
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ✅ Mobile Menu */}
      <div className="flex items-center gap-6 sm:hidden">
        {/* ❤️ Wishlist */}
        <FaHeart
          size={22}
          onClick={() => {
            handleWishlistClick();
            setOpen(false);
          }}
          className={`cursor-pointer transition-colors duration-300 ${
            wishlistActive ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        />

        {/* 🛒 Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* ☰ Menu */}
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      {open && (
        <div className="absolute top-[60px] right-0 w-64 bg-white shadow-lg py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden transition-all duration-300 z-10">
          <NavLink onClick={() => setOpen(false)} to="/">
            Home
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/products">
            All Products
          </NavLink>
          <div className="w-full">
            <p className="font-medium">Categories</p>
            <ul className="ml-3 mt-1">
              {categories.map((cat, index) => (
                <li
                  key={index}
                  className="py-1 hover:text-primary cursor-pointer"
                  onClick={() => {
                    navigate(`/products/${cat.toLowerCase()}`);
                    setOpen(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          <NavLink onClick={() => setOpen(false)} to="/contact">
            Contact
          </NavLink>
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setshowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logOut}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm w-full"
            >
              LogOut
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
