"use client";

import React, { useState, useEffect } from "react";
import { fetchHomeDashboard, TopSellingItem } from "@/api/Home/page";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface HeroSectionProps {
  cartCount?: number;
  onCartClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  cartCount = 0,
  onCartClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHomeDashboard("weekly");
        if (data.success && data.result?.topSellingItems) {
          setTopSellingItems(data.result.topSellingItems);
        } else {
          setTopSellingItems([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load popular items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Container animation variants
  const containerVariants = {
    idle: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 35px 80px -12px rgba(0, 0, 0, 0.4)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 20,
      },
    },
  };

  // Text animation variants
  const textVariants = {
    hidden: {
      opacity: 0,
      x: -40,
      filter: "blur(8px)",
      transition: {
        duration: 0.4,
        ease: easeInOut,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  };

  // Main text animation variants
  const mainTextVariants = {
    centered: {
      opacity: 1,
      x: 48,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: easeInOut,
      },
    },
    shifted: {
      opacity: 0,
      x: 30,
      scale: 0.95,
      filter: "blur(4px)",
      transition: {
        duration: 0.4,
        ease: easeInOut,
      },
    },
  };

  // Image animation variants
  const imageVariants = {
    left: {
      left: "12px",
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as "spring",
        stiffness: 350,
        damping: 30,
        mass: 0.8,
      },
    },
    right: {
      left: "calc(100% - 96px)",
      rotate: 360,
      scale: 1.1,
      transition: {
        type: "spring" as "spring",
        stiffness: 350,
        damping: 30,
        mass: 0.8,
      },
    },
  };

  // Background glow animation
  const glowVariants = {
    idle: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
    active: {
      opacity: 1,
      scale: 1.2,
      transition: { duration: 0.3 },
    },
  };
  const itemVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-zinc-100 overflow-hidden flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-transparent sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/lkb_Logo.png"
                alt="FoodieExpress Logo"
                width={60}
                height={60}
                priority
              />
            </Link>
          </div>

          {/* Center: Navigation (Hidden on mobile) */}
          <nav className="hidden md:flex space-x-8 text-gray-900 font-medium items-center">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-orange-500 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="flex items-center gap-1 hover:text-orange-500 transition-colors duration-200"
            >
              Menu
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1 hover:text-orange-500 transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Search, Cart Icons, and Mobile Menu Button */}

          <div className="flex items-center space-x-4 text-gray-700 ">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1 px-3 py-2 rounded-full border border-gray-300 hover:border-orange-500 hover:bg-orange-100 transition duration-200 cursor-pointer"
            >
              <ShoppingCartIcon className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Cart</span>

              {/* Cart badge */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full border border-gray-300 hover:bg-orange-100 hover:border-orange-500 transition"
            >
              <Bars3Icon className="h-6 w-6 text-orange-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Stylish Mobile Menu Sidebar with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="fixed top-0 right-0 h-full w-72 bg-gradient-to-br from-zinc-50 to-white z-50 flex flex-col shadow-2xl rounded-l-3xl overflow-hidden"
            >
              {/* Top curved design element */}
              <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-r from-orange-400 to-orange-500 rounded-bl-[120px] -z-10"></div>

              {/* Close button with circular background */}
              <div className="absolute top-4 right-4 z-20">
                <motion.button
                  onClick={toggleMobileMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-full p-2 shadow-md"
                >
                  <XMarkIcon className="h-6 w-6 text-orange-500" />
                </motion.button>
              </div>

              {/* Logo and Menu Title */}
              <div className="pt-12 pb-6 px-6">
                <div className="flex items-center mb-6 ">
                  <Image
                    src="/images/lkb_Logo.png"
                    alt="LKB Logo"
                    width={40}
                    height={40}
                    className="mr-3 bg-zinc-100 rounded-full p-1"
                  />
                  <h2 className="text-2xl font-bold text-gray-900">LKB Menu</h2>
                </div>
                {/* <div className="w-16 h-1 bg-orange-500 rounded-full"></div> */}
              </div>

              {/* Navigation Links with Animation */}
              <nav className="flex flex-col px-6 py-4">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="space-y-6"
                >
                  {[
                    { href: "/", label: "Home", icon: "🏠" },
                    { href: "/menu", label: "Menu", icon: "🍔" },
                    { href: "/contact", label: "Contact", icon: "✉️" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 py-2 px-4 rounded-xl hover:bg-orange-100 transition-all duration-300 group"
                        onClick={toggleMobileMenu}
                      >
                        <span className="flex items-center justify-center bg-orange-400 text-orange-800 w-10 h-10 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 text-xl">
                          {item.icon}
                        </span>
                        <span className="text-lg font-medium text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </nav>

              {/* Bottom Section - Contact Information */}
              <div className="mt-auto">
                {/* Decorative Wave Pattern */}
                <div className="w-full h-10 bg-orange-50 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-tr-[80px]"></div>
                </div>

                {/* Contact Information */}
                <div className="p-6 bg-orange-50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-orange-500">📞</span> +91 8260061212
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Overlay with improved animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black backdrop-blur-sm z-40"
              onClick={toggleMobileMenu}
            />
          </>
        )}
      </AnimatePresence>

      <div className=" flex flex-col px-4 sm:px-6 lg:px-12 xl:px-24 bg-zinc-100">
        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-between">
          <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-8 sm:gap-12 py-8 sm:py-12">
            {/* Left Content - Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              // variants={containerVariants}
              className="flex-1 space-y-6 sm:space-y-8 max-w-xl w-full"
            >
              {/* Image for screens below lg */}

              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Hungry for the{" "}
                <span className="text-orange-500 whitespace-nowrap">
                  good stuff?
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl text-gray-600"
              >
                Your cravings just got an upgrade
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
              >
                Explore chef-crafted meals, book your table, or take it to-go.
                <br />
                <span className="font-semibold text-gray-800">
                  Fresh, fast, and made to impress.
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:hidden mb-6 my-10"
              >
                <Image
                  src="/images/mobileFrame.png"
                  alt="Delicious food"
                  width={600}
                  height={400}
                  className="w-full  h-auto rounded-xl object-cover"
                  priority
                />
              </motion.div>

              <div className="relative max-w-[30rem] mx-auto my-20">
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl"
                  variants={glowVariants}
                  animate={isHovered ? "active" : "idle"}
                />

                {/* Main container */}
                        <Link href="/menu" passHref>

                <motion.div
                  variants={containerVariants}
                  animate={isPressed ? "tap" : isHovered ? "hover" : "idle"}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  onTapStart={() => setIsPressed(true)}
                  onTap={() => setIsPressed(false)}
                  onTapCancel={() => setIsPressed(false)}
                  className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-full mx-auto cursor-pointer overflow-hidden border border-zinc-700/50 backdrop-blur-sm"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-full relative">
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"
                      animate={{
                        x: isHovered ? ["-100%", "200%"] : "-100%",
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-5">
                      {/* Left side text - appears on hover */}
                      <motion.div
                        variants={textVariants}
                        animate={isHovered ? "visible" : "hidden"}
                        className="absolute left-8 sm:left-12 lg:left-16 top-1/2 transform -translate-y-1/2 z-20"
                      >
                        <motion.h2
                          className="text-lg sm:text-xl font-bold text-white mb-1"
                          variants={textVariants}
                        >
                          Ready?
                        </motion.h2>
                        <motion.p
                          className="text-white/70 text-sm"
                          variants={textVariants}
                        >
                          Let's order!
                        </motion.p>
                      </motion.div>

                      {/* Main centered text */}
                      <motion.div
                        variants={mainTextVariants}
                        animate={isHovered ? "shifted" : "centered"}
                        className="text-center flex-1 relative z-10 pr-16 sm:pr-20 lg:pr-24"
                      >
                        <h1 className="text-md sm:text-xl lg:text-2xl font-bold text-white mb-1">
                          Start Your Order
                        </h1>
                        <p className="text-white/70 text-xs sm:text-base">
                          Fresh food delivered to your door
                        </p>
                      </motion.div>

                      {/* Animated food icon */}
                      <motion.div
                        variants={imageVariants}
                        animate={isHovered ? "right" : "left"}
                        className="absolute top-1/2 transform -translate-y-1/2 z-30"
                        whileHover={{
                          scale: 1.2,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 },
                        }}
                      >
                        <motion.div
                          className="bg-gradient-to-br from-white to-zinc-100 rounded-full p-1 shadow-2xl border border-white/20"
                          whileHover={{
                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                          }}
                        >
                          <motion.div
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center"
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <motion.span
                              className="text-2xl"
                              animate={{
                                rotate: isHovered ? [0, 15, -15, 0] : 0,
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: isHovered ? Infinity : 0,
                                repeatType: "reverse",
                              }}
                            >
                              <Image
                                src="/images/burger.png"
                                alt="LKB Logo"
                                width={40}
                                height={40}
                                className="mr-3 w-full h-full bg-zinc-100 rounded-full p-1"
                              />
                            </motion.span>
                          </motion.div>
                        </motion.div>
                      </motion.div>

                     
                    </div>
                  </div>
                </motion.div>
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Most Ordered This Week
                </h3>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {isLoading ? (
                    [...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="min-w-[11rem] sm:min-w-[15rem] rounded-xl bg-white border border-dashed p-4 flex-shrink-0 animate-pulse"
                      >
                        <div className="flex flex-col sm:flex-row gap-5 justify-between items-center">
                          <div className="bg-gray-200 rounded-lg mb-3 w-full h-24"></div>
                          <div className="flex flex-col flex-grow w-full">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : error ? (
                    <div className="w-full text-center py-4 text-red-500">
                      {error}
                    </div>
                  ) : topSellingItems.length > 0 ? (
                    topSellingItems.map((item, index) => (
                      <div
                        key={item.menuDetails._id}
                        className="min-w-[11rem] sm:min-w-[15rem] rounded-xl bg-white border border-dashed p-3 flex-shrink-0"
                      >
                        <div className="flex flex-col sm:flex-row gap-5 justify-between items-center">
                          <div className="relative bg-gray-50 rounded-lg mb-1 flex items-center justify-center">
                            <Image
                              src={
                                item.menuDetails.image || "/images/burger.png"
                              }
                              alt={item.menuDetails.name}
                              width={80}
                              height={80}
                              className="w-40 h-30 rounded-md object-cover"
                              unoptimized={true}
                            />
                            <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                              Hot
                            </span>
                          </div>
                          <div className="flex flex-col flex-grow">
                            <h4 className="text-md font-bold text-gray-800 mb-1">
                              {item.menuDetails.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">{`${item.thisWeek.quantity} orders this week`}</p>
                            <div className="mt-auto flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-800">
                                ₹{item.menuDetails.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-4 text-gray-500">
                      No popular items found this week
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Content - Overlapping Images  */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 hidden lg:flex justify-center items-center w-full mt-8 lg:mt-0"
            >
              {/* <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl aspect-square"> */}
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-2xl aspect-square">
                {/* Background Image  */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute hidden lg:block -top-50 lg:-top-80 xl:-top-60 md:left-10 lg:left-50 xl:left-90 2xl:left-130 lg:w-[250%] lg:h-[250%] xl:w-[170%] xl:h-[170%]"
                >
                  <Image
                    src="/images/bg-main.jpg"
                    alt="Tasty pizza"
                    fill
                    className="object-cover rounded-full"
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </motion.div>

                {/* Overlapping Top Image - Responsive */}
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute left-30  -top-10 lg:-top-20 lg:left-10 xl:left-30 w-full h-full z-10 flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/bg-main-top.png"
                      alt="Delicious burger"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                    />

                    {/* Orange Box with Text */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="absolute -bottom-45 lg:-bottom-55 xl:-bottom-45 2xl:-bottom-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#E0682D] text-white px-4 py-3 sm:px-6 sm:py-4 rounded-3xl backdrop-blur-sm bg-opacity-95 -z-20 w-70 h-40 xl:w-[20rem] lg:h-70 lg:w-[15rem] xl:h-60 flex flex-col justify-end shadow-[-12px_-8px_0_rgba(232,180,113,100)]"
                    >
                      <div className="text-center">
                        <h3 className="text-base lg:text-xl font-bold mb-1">
                          Chicken Biryani
                        </h3>
                        <p className="text-sm sm:text-base font-medium opacity-90">
                          #1 on the Menu
                        </p>
                        <p className="text-xs sm:text-lg mt-1 font-light bg-zinc-900 rounded-full px-2 py-3">
                          Have It Delivered
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
