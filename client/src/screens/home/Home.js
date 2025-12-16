import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/home/Nav";
import Slider from "../../components/home/Slider";
import Categories from "../../components/home/Categories";
import HomeProduct from "../../components/home/HomeProduct";
import { useRandomCategoriesQuery } from "../../store/services/categoryService";
import { useGetAllProductsQuery } from "../../store/services/productService";
import AppImage from "../../components/common/AppImage";

const Home = () => {
  // 1. State to track how many products to show (start with 8)
  const [visibleCount, setVisibleCount] = useState(8);

  // 2. State to track liked products (Array of IDs)
  const [likedProducts, setLikedProducts] = useState([]);

  const { data: categoriesData, isFetching: isCategoriesFetching } =
    useRandomCategoriesQuery();

  const {
    data: productsData,
    isFetching: isProductsFetching,
    error,
    isLoading,
  } = useGetAllProductsQuery();

  // 3. Function to handle "Show More" click
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4); // Load 4 more items
  };

  // 4. Function to toggle like status
  const toggleLike = (id) => {
    if (likedProducts.includes(id)) {
      // If already liked, remove it
      setLikedProducts(likedProducts.filter((productId) => productId !== id));
    } else {
      // If not liked, add it
      setLikedProducts([...likedProducts, id]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-20">
      <Nav />

      {/* Hero Section */}
      <div className="pt-[80px] lg:pt-[90px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <Slider />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Shop by Category
            </h2>
          </div>
          <Categories />
        </section>

        {/* Shop by Products Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Just For You
            </h2>
            <Link
              to="/products"
              className="group flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all products
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {isProductsFetching ? (
            /* Product Grid Skeleton */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-[320px] w-full animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {productsData?.products
                  ?.slice(0, visibleCount)
                  .map((product) => {
                    // Check if this specific product is liked
                    const isLiked = likedProducts.includes(product._id);

                    return (
                      <div
                        key={product._id}
                        className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                          <AppImage
                            src={
                              product.image1 || product.image2 || product.image3
                            }
                            alt={product.name}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Discount Badge */}
                          {product.discount > 0 && (
                            <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                              -{product.discount}%
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col p-4">
                          <Link
                            to={`/product/${product._id}`}
                            className="hover:text-indigo-600 transition-colors"
                          >
                            {product.title}
                          </Link>

                          {/* Price Section */}
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-gray-900">
                                $
                                {product.price -
                                  Math.floor(
                                    (product.price * product.discount) / 100
                                  )}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  ${product.price}
                                </span>
                              )}
                            </div>

                            {/* Add to Favorite Button (Modified) */}
                            <button
                              onClick={() => toggleLike(product._id)}
                              className={`rounded-full p-2 transition-colors duration-300 ${
                                isLiked
                                  ? "bg-pink-50 text-pink-500 hover:bg-pink-100"
                                  : "bg-gray-100 text-gray-600 hover:bg-pink-500 hover:text-white"
                              }`}
                              title={
                                isLiked
                                  ? "Remove from Favorites"
                                  : "Add to Favorites"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill={isLiked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Show More Button */}
              {productsData?.products?.length > visibleCount && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleShowMore}
                    className="rounded-full border border-indigo-600 bg-white px-8 py-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Category Specific Feeds */}
        <section className="space-y-16 border-t border-gray-100 pt-16">
          <div className="flex items-center space-x-2">
            <span className="h-8 w-1 rounded-full bg-indigo-600"></span>
            <h2 className="text-2xl font-bold text-gray-900">
              Curated Collections
            </h2>
          </div>

          {isCategoriesFetching ? (
            <div className="space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="w-full space-y-4">
                  <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-80 animate-pulse rounded-xl bg-gray-200"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            categoriesData?.categories?.map((category) => (
              <div
                key={category._id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                <HomeProduct category={category} />
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
