import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY;
  const [cartItems, setcartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState({}); // ✅ Wishlist state
  const [searchQuary, setSearchQuary] = useState({});

  // ✅ Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success ? true : false);
    } catch {
      setIsSeller(false);
    }
  };

  // ✅ Fetch user-auth status, user data, and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth", {
        withCredentials: true,
      });
      if (data.success) {
        setUser(data.user);
        setcartItems(data.user.cartItems || {});
        setWishlistItems(data.user.wishlistItems || {}); // ✅ Load wishlist from backend if available
      }
    } catch {
      setUser(null);
    }
  };

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setcartItems(cartData);
    toast.success("Added to Cart");
  };

  // ✅ Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setcartItems(cartData);
    toast.success("Cart Updated");
  };

  // ✅ Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    setcartItems(cartData);
    toast.success("Removed from Cart");
  };

  // ✅ Add product to wishlist
  const addToWishlist = (itemId) => {
    let wishlistData = structuredClone(wishlistItems);
    wishlistData[itemId] = true;
    setWishlistItems(wishlistData);
    toast.success("Added to Wishlist 💖");
  };

  // ✅ Remove product from wishlist
  const removeFromWishlist = (itemId) => {
    let wishlistData = structuredClone(wishlistItems);
    delete wishlistData[itemId];
    setWishlistItems(wishlistData);
    toast.success("Removed from Wishlist 💔");
  };

  // ✅ Get wishlist count
  const getWishlistCount = () => {
    return Object.keys(wishlistItems).length;
  };

  // ✅ Get cart item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) totalCount += cartItems[item];
    return totalCount;
  };

  // ✅ Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      let itemInfo = products.find((product) => product._id === id);
      if (itemInfo && cartItems[id] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[id];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // ✅ Initial data load
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ Update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) updateCart();
  }, [cartItems]);

  // ✅ Update wishlist in backend whenever it changes (optional)
  useEffect(() => {
    const updateWishlist = async () => {
      try {
        const { data } = await axios.post("/api/user/wishlist", {
          wishlistItems,
        });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (user) updateWishlist();
  }, [wishlistItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setshowUserLogin,
    products,
    setProducts,
    currency,
    cartItems,
    setcartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    wishlistItems, // ✅ Added
    setWishlistItems, // ✅ Added
    addToWishlist, // ✅ Added
    removeFromWishlist, // ✅ Added
    getWishlistCount, // ✅ Added
    searchQuary,
    setSearchQuary,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
