"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { OfferBanner } from "@/api/Home/page";

interface OfferBannerModalProps {
  banners: OfferBanner[];
  isOpen: boolean;
  onClose: () => void;
}

const OfferBannerModal: React.FC<OfferBannerModalProps> = ({
  banners,
  isOpen,
  onClose,
}) => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length > 1 && isOpen) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % banners.length);
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length, isOpen]);

  // Reset to first slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentOfferIndex(0);
    }
  }, [isOpen]);

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % banners.length);
  };

  const prevOffer = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToOffer = (index: number) => {
    setCurrentOfferIndex(index);
  };

  if (!banners.length) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={onClose}
          >
            {/* Modal Content - Responsive sizing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className="rounded-xl sm:rounded-2xl 
                         w-full h-[90vh] max-w-sm
                         sm:w-full sm:h-[85vh] sm:max-w-md
                         md:w-full md:h-[80vh] md:max-w-2xl
                         lg:w-[80rem] lg:h-full lg:max-w-none
                         flex flex-col overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 transition-colors bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Image Section - Maintains aspect ratio */}
              <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                {/* Dot Indicators */}
                {banners.length > 1 && (
                  <div className="absolute bottom-15 sm:bottom-20 left-0 right-0 z-20 flex justify-center items-center">
                    <div className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/20 backdrop-blur-sm rounded-full">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToOffer(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === currentOfferIndex 
                              ? 'w-6 h-2.5 sm:w-8 sm:h-3 bg-orange-500 shadow-lg' 
                              : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white hover:bg-white/90 shadow-md'
                          }`}
                        />
                      ))}
                      <span className="text-xs sm:text-sm text-white ml-2 drop-shadow-md font-medium">
                        {currentOfferIndex + 1}/{banners.length}
                      </span>
                    </div>
                  </div>
                )}
                
                <motion.div
                  key={currentOfferIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  {/* Image container that maintains aspect ratio */}
                  <div className="relative w-full h-full max-w-full max-h-full">
                    <Image
                      src={banners[currentOfferIndex]?.imageUrl}
                      alt={`Special Offer ${currentOfferIndex + 1}`}
                      fill
                      className="object-contain" // Changed from object-cover to object-contain
                      unoptimized={true}
                      priority
                    />
                  </div>
                  
                  {/* Offer Badge */}
                  {/* <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1.5 sm:px-4 sm:py-3 rounded-full shadow-lg animate-pulse z-10">
                    Limited Time
                  </div> */}

                  {/* Gradient overlay at bottom for better button visibility */}
                  {/* <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div> */}
                </motion.div>

                {/* Navigation Arrows - Hidden on mobile, shown on larger screens */}
                {banners.length > 1 && (
                  <>
                    <button
                      onClick={prevOffer}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hidden sm:block"
                    >
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={nextOffer}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hidden sm:block"
                    >
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

              </div>

              {/* Action Buttons - Responsive positioning and sizing */}
              <div className="absolute bottom-2 sm:bottom-6 left-0 right-0 z-20 flex justify-center items-center space-x-2 sm:space-x-3 px-4">
                <Link href="/menu">
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 sm:py-2.5 px-4 sm:px-5 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                  >
                    Order Now
                  </motion.button>
                </Link>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full font-semibold hover:bg-white transition-all duration-200 shadow-lg text-xs sm:text-sm"
                >
                  Maybe Later
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OfferBannerModal;