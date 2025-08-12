"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";
import {
  fetchMenuItems,
  fetchCategories,
  MenuItem,
  MenuFilters,
  Category as ApiCategory,
} from "@/api/Menu/page";

// Define the Category type for legacy compatibility
interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDiet, setSelectedDiet] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [menuItems, setMenuItems] = useState<
    (MenuItem & { category: string | Category })[]
  >([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(32);

  const { addToCart, cartItems } = useCart();

  // Fetch categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await fetchCategories(1, 90);
        const categoryNames = response.result.categories.map((cat) => cat.name);
        setCategories(["All", ...categoryNames]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoriesError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
        // Fallback to "All" if categories fail to load
        setCategories(["All"]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Fetch menu items from API
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: MenuFilters = {
          page: currentPage,
          limit: itemsPerPage,
        };

        // Add availability filter
        if (selectedAvailability !== "All") {
          filters.isAvailable = selectedAvailability === "Available";
        }

        // Add diet filter
        if (selectedDiet !== "All") {
          filters.isVeg = selectedDiet === "Veg";
        }

        // Add category filter
        if (selectedCategory !== "All") {
          filters.categoryName = selectedCategory;
        }

        const response = await fetchMenuItems(filters);
        setMenuItems(response.result.menus);
        setTotalPages(response.result.pages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load menu items"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [
    currentPage,
    itemsPerPage,
    selectedCategory,
    selectedDiet,
    selectedAvailability,
  ]);

  const diets = ["All", "Veg", "Non-Veg"];
  const availabilityOptions = ["All", "Available", "Unavailable"];

  // Since we're now filtering on the server side, we don't need client-side filtering
  const filteredItems = menuItems;

  // Convert API MenuItem to Cart MenuItem format
  const convertToCartItem = (apiItem: MenuItem) => ({
    id: parseInt(apiItem._id.slice(-6), 16),
    originalId: apiItem._id, // Keep original ID for API calls
    name: apiItem.name,
    description: apiItem.description,
    price: apiItem.price,
    image: apiItem.image,
    isVeg: apiItem.isVeg,
    category: apiItem.category,
  });

  // Check if an item is in the cart
  const isItemInCart = (itemId: number) => {
    return cartItems.some((cartItem) => cartItem.id === itemId);
  };

  // Function to handle image URLs properly
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    // If it's a relative path, use it directly
    if (imageUrl.startsWith("/")) return imageUrl;

    try {
      // Check if URL is valid
      const url = new URL(imageUrl);
      // Use the URL as is
      return imageUrl;
    } catch (e) {
      // If not a valid URL format, return empty
      return "";
    }
  };

  // Add loading and error states to JSX
  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 px-2 sm:px-3 py-4 sm:py-8">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-4 bg-zinc-50 rounded-2xl sm:rounded-3xl p-2 sm:p-4 mb-4 sm:mb-8">
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🍽️</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
              {categoriesLoading ? "Loading categories..." : "Loading menu..."}
            </h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 px-2 sm:px-3 py-4 sm:py-8">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-4 bg-zinc-50 rounded-2xl sm:rounded-3xl p-2 sm:p-4 mb-4 sm:mb-8">
          <div className="text-center py-8 sm:py-12">
            <div className="text-red-400 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
              Error loading menu
            </h3>
            <p className="text-gray-600 text-sm sm:text-base px-4 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-3 py-4 sm:py-8">
      <div className="max-w-[90rem] mx-auto px-2 sm:px-4 bg-zinc-50 rounded-2xl sm:rounded-3xl p-2 sm:p-4 mb-4 sm:mb-8">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Page Title - Mobile Only */}
          <div className="block sm:hidden mb-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Our Menu
            </h1>
          </div>

          {/* Filters */}
          <div className="w-full mb-6 sm:mb-8">
            <div className="flex flex-col gap-4">
              {/* Categories */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-gray-600 font-medium text-sm sm:text-base min-w-[80px]">
                    Categories:
                  </span>
                </div>
                <div className="flex-1 w-full min-w-0">
                  {" "}
                  {/* Added min-w-0 to prevent overflow issues */}
                  <div className="relative">
                    {/* Horizontal scroll container */}
                    <div className=" flex overflow-x-auto pb-3 hide-scrollbar scroll-smooth">
                      {" "}
                      {/* Added scroll-smooth for better UX */}
                      <div className="ml-5 flex flex-nowrap gap-2 pr-4">
                        {" "}
                        {/* Added right padding for last item visibility */}
                        {categoriesError ? (
                          // Error state with retry
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                              Failed to load categories
                            </div>
                            <button
                              onClick={() => window.location.reload()}
                              className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                            >
                              Retry
                            </button>
                          </div>
                        ) : categories.length > 1 ? (
                          <>
                            {/* Category buttons */}
                            {categories.map((category, index) => (
                              <button
                                key={`${category}-${index}`}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setCurrentPage(1);
                                }}
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                                  selectedCategory === category
                                    ? "bg-orange-500 text-white "
                                    : "bg-white text-gray-700 hover:border-orange-500 hover:text-orange-500 cursor-pointer border border-gray-200"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </>
                        ) : (
                          // Loading skeleton for categories
                          <div className="flex gap-2">
                            {[...Array(5)].map((_, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 rounded-full bg-gray-200 animate-pulse flex-shrink-0"
                                style={{ width: "80px", height: "32px" }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Optional gradient fade effect at the ends */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Diet and Availability Filters */}
              <div className="flex  justify-between flex-row items-end gap-4 sm:gap-8">
                {/* Diet Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="text-gray-600 font-medium text-sm sm:text-base flex-shrink-0 min-w-[40px]">
                    Diet:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {diets.map((diet) => (
                      <button
                        key={diet}
                        onClick={() => {
                          setSelectedDiet(diet);
                          setCurrentPage(1); // Reset to first page when filtering
                        }}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                          selectedDiet === diet
                            ? "bg-orange-500 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:border-orange-500 hover:text-orange-500 cursor-pointer border border-gray-200"
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>


                {(selectedCategory !== "All" ||
                selectedDiet !== "All" ||
                selectedAvailability !== "All") && (
                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedDiet("All");
                      setSelectedAvailability("All");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-orange-500 underline transition-colors duration-200 cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              </div>

              {/* Clear Filters Button */}
              
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item._id}
                className={`bg-white rounded-xl border-1 border-zinc-200 hover:shadow-sm transition-all duration-300 overflow-hidden group ${
                  !item.isAvailable ? "opacity-75" : ""
                }`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    className={`w-full h-40 sm:h-48 px-2 sm:px-3 py-2 sm:py-3 rounded-2xl sm:rounded-3xl object-cover ${
                      !item.isAvailable ? "grayscale" : ""
                    }`}
                    unoptimized={true} // Skip Next.js optimization for all images
                  />
                  {/* Veg/Non-Veg Badge */}
                  <div className="absolute top-3 sm:top-5 left-3 sm:left-5">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isVeg
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isVeg ? "Veg" : "Non Veg"}
                    </div>
                  </div>
                  {/* Availability Badge */}
                  {!item.isAvailable && (
                    <div className="absolute top-12 sm:top-14 left-3 sm:left-5">
                      <div className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Unavailable
                      </div>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-3 sm:top-5 right-3 sm:right-5 bg-zinc-100 text-zinc-900 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                    ₹{item.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3
                    className={`font-semibold text-base sm:text-lg mb-1 sm:mb-2 ${
                      !item.isAvailable ? "text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 ${
                      !item.isAvailable ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Add to Cart Button or Added Status */}
                  {!item.isAvailable ? (
                    <div className="w-full flex items-center justify-center">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <span className="text-lg">⚠️</span>
                        <span className="text-sm font-medium">
                          Currently unavailable
                        </span>
                      </div>
                    </div>
                  ) : isItemInCart(parseInt(item._id.slice(-6), 16)) ? (
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-green-600">
                        <span className="text-lg">✓</span>
                        <span className="text-sm font-medium">
                          Added to cart
                        </span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(convertToCartItem(item))}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer text-sm sm:text-base"
                    >
                      <span>+</span>
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🍽️</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 text-sm sm:text-base px-4">
                Try adjusting your filters to see more items.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center">
              <div className="flex items-center space-x-2">
                {/* Previous Page Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-orange-500 hover:bg-orange-50 border border-orange-500"
                  }`}
                >
                  ←
                </button>

                {/* Page Numbers */}
                <div className="flex items-center">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    const isNearCurrent =
                      Math.abs(pageNumber - currentPage) <= 1;
                    const isFirstOrLast =
                      pageNumber === 1 || pageNumber === totalPages;

                    if (isNearCurrent || isFirstOrLast) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`mx-1 min-w-[40px] h-10 rounded-lg transition-all duration-200 ${
                            isCurrentPage
                              ? "bg-orange-500 text-white font-medium shadow-lg transform scale-110"
                              : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (index === 1 && currentPage > 3) ||
                      (index === totalPages - 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={index} className="mx-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-orange-500 hover:bg-orange-50 border border-orange-500"
                  }`}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .hide-scrollbar {
            -ms-overflow-style: none; /* Internet Explorer 10+ */
            scrollbar-width: none; /* Firefox */
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
          }

          /* Mobile-first responsive adjustments */
          @media (max-width: 640px) {
            .grid {
              gap: 1rem;
            }

            .rounded-3xl {
              border-radius: 1rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MenuPage;
