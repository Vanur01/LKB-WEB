"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { getTotalItems, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <header className="bg-zinc-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Logo Image */}
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

        {/* Center: Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-orange-600"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="flex items-center gap-1 hover:text-orange-600"
          >
            Menu
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1 hover:text-orange-600"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Search, Cart Icons, and Mobile Menu Button */}

        <div className="flex items-center space-x-4 text-gray-700 ">
          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1 px-3 py-2 rounded-full border border-gray-300 hover:border-orange-500 hover:bg-orange-100 transition duration-200 cursor-pointer"
          >
            <ShoppingCartIcon className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Cart</span>

            {/* Cart badge */}
            {getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                {getTotalItems()}
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

              {/* Bottom Section */}
              <div className="mt-auto">
                {/* Decorative Wave Pattern */}
                <div className="w-full h-10 bg-orange-50 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-tr-[80px]"></div>
                </div>

                {/* Contact Information */}
                <div className="p-6 bg-orange-50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-orange-500">📞</span> +91 7008203600
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
    </header>
  );
}
