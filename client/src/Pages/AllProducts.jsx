import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../Context/AppContext";
import ProductCard from "../Components/ProductCard";

const AllProducts = () => {
  const { products, searchQuary } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(30);
  const [isLoading, setIsLoading] = useState(false); // 👈 to control loading animation
  const loadMoreRef = useRef(null);

  // ✅ Filter products based on search query
  useEffect(() => {
    if (searchQuary.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuary.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuary]);

  // ✅ Intersection Observer for lazy loading with max 3s delay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);

          // ⏱ Simulate smooth loading (max 3 sec)
          const timer = setTimeout(() => {
            setVisibleCount((prev) => prev + 30);
            setIsLoading(false);
          }, 1500 + Math.random() * 1500); // 1.5s to 3s realistic delay
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isLoading]);

  const visibleProducts = filteredProducts
    .filter((product) => product.inStock)
    .slice(0, visibleCount);

  return (
    <div className="mt-16 flex flex-col px-4 sm:px-6 md:px-10">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
        {visibleProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* ✅ Loader Trigger */}
      {visibleCount < filteredProducts.length && (
        <div
          ref={loadMoreRef}
          className="text-center py-6 text-gray-500 animate-pulse"
        >
          {isLoading ? "Loading more products..." : ""}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
