import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../Context/AppContext";

const LastOrdered = () => {
  const { axios, user } = useAppContext();
  const [lastOrderedProducts, setLastOrderedProducts] = useState([]);

  const fetchLastOrdered = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success && data.orders.length > 0) {
        // Get all ordered items (flattened array)
        const allItems = data.orders.flatMap((order) => order.items);

        // Sort by latest order date
        const sortedItems = allItems.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Take latest 5 unique products
        const uniqueProducts = [];
        const seen = new Set();

        for (const item of sortedItems) {
          const productId = item.product._id || item.product.id;
          if (!seen.has(productId)) {
            seen.add(productId);
            uniqueProducts.push(item.product);
          }
          if (uniqueProducts.length >= 5) break;
        }

        setLastOrderedProducts(uniqueProducts);
      } else {
        setLastOrderedProducts([]);
      }
    } catch (error) {
      console.log("Error fetching last ordered products:", error);
    }
  };

  useEffect(() => {
    if (user) fetchLastOrdered();
  }, [user]);

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Last Ordered Items</p>
      {lastOrderedProducts.length === 0 ? (
        <p className="text-gray-500 mt-4">No recent orders found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
          {lastOrderedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LastOrdered;
