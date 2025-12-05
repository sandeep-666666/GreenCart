import React from "react";
import "./index.css";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer";
import { useAppContext } from "./Context/AppContext";
import Login from "./Components/Login";
import AllProducts from "./Pages/AllProducts";
import ProductCategory from "./Pages/ProductCategory";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import AddAddress from "./Pages/AddAddress";
import MyOrders from "./Pages/MyOrders";
import SellerLogin from "./Components/Seller/SellerLogin";
import SellerLayout from "./Pages/seller/SellerLayout";
import AddProduct from "./Pages/seller/AddProduct";
import ProductList from "./Pages/seller/ProductList";
import Orders from "./Pages/seller/Orders";
import Loading from "./Components/Loading";
import Wishlist from "./Pages/Wishlist";

const App = () => {
  const isSellerpath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerpath ? "" : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />
      <div
        className={`${isSellerpath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/loader" element={<Loading />} />
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerpath && <Footer />}
    </div>
  );
};

export default App;
