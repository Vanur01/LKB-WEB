"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ClockIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  MapPinIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/api/Cart/page";
import { load } from "@cashfreepayments/cashfree-js";

// Type definitions for Cashfree SDK
interface CashfreeSDK {
  checkout: (options: CashfreeCheckoutOptions) => Promise<void>;
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: "_self" | "_blank";
}

// Extended response type for order creation with payment session ID
interface OrderResponseWithPayment {
  success: boolean;
  paymentSessionId?: string;
  [key: string]: any;
}

const CheckoutPage = () => {
  const router = useRouter();
  const {
    cartItems,
    refreshCart,
    getTotalItems,
    getTotalPrice,
    isLoading: cartLoading,
    cartSummary
  } = useCart();
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [currentStep, setCurrentStep] = useState("selection"); // 'selection', 'details'
  const [isLoading, setIsLoading] = useState(true);
  const [cashfreeInstance, setCashfreeInstance] = useState<CashfreeSDK | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    hostel: "",
    roomNumber: "",
    floor: "",
    phoneNumber: "",
    tableNumber: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    general: "",
    firstName: false,
    lastName: false, 
    hostel: false,
    roomNumber: false,
    floor: false,
    phoneNumber: false,
    tableNumber: false
  });

  // Fixed values for charges and tax
  const deliveryCharges = 30;

  // Fetch the latest cart items when the component mounts
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      await refreshCart();
      setIsLoading(false);
    };

    loadCart();
  }, []);

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeCashfree = async () => {
      try {
        if (typeof window !== 'undefined') {
          const cashfree = await load({
            mode: "production"
          });
          setCashfreeInstance(cashfree);
        }
      } catch (error) {
        console.error("Failed to initialize Cashfree SDK:", error);
      }
    };
    
    initializeCashfree();
  }, []);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();

  // Removed hostels array as we're using direct input now

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    setCurrentStep("details");
  };

  const handleBack = () => {
    setCurrentStep("selection");
  };

  const handleProceedToCheckout = async () => {
    try {
      // Show loading state
      setIsLoading(true);
      
      // Reset previous validation errors
      const newValidationErrors = {
        general: "",
        firstName: false,
        lastName: false,
        hostel: false,
        roomNumber: false,
        floor: false,
        phoneNumber: false,
        tableNumber: false
      };
      
      let hasErrors = false;
      
      // Validate form data
      if (selectedOption === "delivery") {
        if (!formData.firstName) { newValidationErrors.firstName = true; hasErrors = true; }
        if (!formData.lastName) { newValidationErrors.lastName = true; hasErrors = true; }
        if (!formData.hostel) { newValidationErrors.hostel = true; hasErrors = true; }
        if (!formData.roomNumber) { newValidationErrors.roomNumber = true; hasErrors = true; }
        if (!formData.floor) { newValidationErrors.floor = true; hasErrors = true; }
        if (!formData.phoneNumber) { newValidationErrors.phoneNumber = true; hasErrors = true; }
        
        if (hasErrors) {
          newValidationErrors.general = "Please fill in all required fields";
          setValidationErrors(newValidationErrors);
          setIsLoading(false);
          return;
        }
      } else {
        // Dinein validation
        if (!formData.firstName) { newValidationErrors.firstName = true; hasErrors = true; }
        if (!formData.lastName) { newValidationErrors.lastName = true; hasErrors = true; }
        if (!formData.tableNumber) { newValidationErrors.tableNumber = true; hasErrors = true; }
        if (!formData.phoneNumber) { newValidationErrors.phoneNumber = true; hasErrors = true; }
        
        if (hasErrors) {
          newValidationErrors.general = "Please fill in all required fields";
          setValidationErrors(newValidationErrors);
          setIsLoading(false);
          return;
        }
      }
      
      // Prepare order details based on selected option
      const orderType = selectedOption === "delivery" ? "delivery" : "dinein";
      
      let orderDetails;
      
      if (orderType === "delivery") {
        orderDetails = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          hostel: formData.hostel,
          roomNumber: formData.roomNumber,
          floor: formData.floor,
          phone: formData.phoneNumber
        };
      } else {
        orderDetails = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          tableNumber: formData.tableNumber,
          phone: formData.phoneNumber
        };
      }
      
      console.log('Submitting order:', orderType, orderDetails);
      
      // Call the API to create the order
      const response = await createOrder(orderType as 'delivery' | 'dinein', orderDetails);
      
      if (response && response.success) {
        console.log('Order created successfully:', response);
        
        // Check if Cashfree SDK is initialized
        if (!cashfreeInstance) {
          console.error('Cashfree SDK not initialized');
          setValidationErrors({...validationErrors, general: "Payment gateway not available. Please try again later."});
          setIsLoading(false);
          return;
        }
        
        try {
          // Get the payment session ID from the response
          // The response structure has the payment session ID in result.order.paymentSessionId
          
          // Extract the payment session ID from the nested response structure
          const paymentSessionId = response?.result?.order?.paymentSessionId
          
          console.log('Payment Session ID:', paymentSessionId);
          
          // Configure the payment options
          const checkoutOptions: CashfreeCheckoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_self" as "_self", // Open in the same tab
          };
          
          // Initialize the payment
          console.log('Initializing Cashfree payment with options:', checkoutOptions);
          await cashfreeInstance.checkout(checkoutOptions);
          
          // The user will be redirected to the Cashfree payment page
          // After payment, Cashfree will redirect back to your configured callback URL
        } catch (paymentError) {
          console.error('Payment initialization failed:', paymentError);
          setValidationErrors({...validationErrors, general: "Failed to initialize payment. Please try again."});
          setIsLoading(false);
        }
      } else {
        // Handle error case
        console.error('Failed to create order:', response);
        setValidationErrors({...validationErrors, general: "Failed to create order. Please try again."});
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setValidationErrors({...validationErrors, general: "An error occurred while creating your order."});
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    unselected: {
      scale: 1,
      boxShadow:
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      transition: { duration: 0.3 },
    },
    selected: {
      scale: 1.02,
      boxShadow:
        "0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      transition: { duration: 0.3 },
    },
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-4 sm:py-8 px-3 sm:px-4">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence
          mode="wait"
          custom={currentStep === "details" ? 1 : -1}
        >
          {currentStep === "selection" ? (
            <motion.div
              key="selection"
              custom={-1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <motion.div
                className="text-center mb-6 sm:mb-8"
                variants={itemVariants}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2 px-4">
                  How would you like your order?
                </h1>
                <p className="text-sm sm:text-base text-zinc-600 px-4">
                  Choose your preferred dining option
                </p>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border bg-gradient-to-br from-orange-500/5 to-orange-200/1 border-zinc-300"
                variants={itemVariants}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 mb-4">
                  Order Summary
                </h2>

                {/* Loading State */}
                {(isLoading || cartLoading) && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-orange-500 mb-4"></div>
                    <p className="text-zinc-500 text-sm">
                      Loading your order details...
                    </p>
                  </motion.div>
                )}

                {/* Empty Cart State */}
                {!isLoading && !cartLoading && cartItems.length === 0 && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-zinc-300 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-zinc-500 text-center">
                      Your cart is empty
                    </p>
                    <p className="text-zinc-400 text-sm text-center mt-1">
                      Add some delicious items from our menu
                    </p>
                  </motion.div>
                )}

                {/* Cart Items and Bill Summary */}
                {!isLoading && !cartLoading && cartItems.length > 0 && (
                  <div>
                    {/* Cart Items */}
                    <div className="space-y-3 mb-6">
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="flex justify-between items-center border-b border-zinc-100 pb-2 last:border-b-0 last:pb-0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100,
                            damping: 10,
                          }}
                        >
                          <div className="flex items-center flex-1 gap-3">
                            <span className="text-sm sm:text-base text-zinc-700">
                              {item.name}
                            </span>
                            <span className="bg-orange-100 text-orange-800 text-xs font-medium h-5 w-5 rounded-full flex items-center justify-center mr-2">
                              {item.quantity}
                            </span>
                          </div>
                          <span className="font-medium text-sm sm:text-base">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bill Summary */}
                    <motion.div
                      className="border-t border-dashed border-zinc-300 pt-4 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <h3 className="text-sm font-medium text-zinc-800 mb-3">
                        Bill Details
                      </h3>
                      <div className="space-y-3">
                        {/* Subtotal */}
                        <motion.div
                          className="flex justify-between text-sm sm:text-base text-zinc-600"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span>Subtotal ({totalItems} items)</span>
                          <span className="font-medium">
                            ₹{cartSummary ? cartSummary.totalPrice : subtotal.toFixed(2)}
                          </span>
                        </motion.div>

                        {/* Delivery Fee */}
                        {selectedOption === "delivery" && (

                        <motion.div
                          className="flex justify-between text-sm sm:text-base text-zinc-600"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <span>Delivery Charges</span>
                          <span className="font-medium">
                            ₹{cartSummary ? cartSummary.deliveryCharge : deliveryCharges.toFixed(2)}
                          </span>
                        </motion.div> 
                        )}
                     
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Total Amount - Only show when cart has items */}
                {!isLoading && !cartLoading && cartItems.length > 0 && (
                  <motion.div
                    className="border-t pt-4 border-zinc-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.7,
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                    }}
                  >
                    <div className="flex justify-between items-center font-semibold text-base sm:text-lg">
                      <span>Total Amount</span>
                      <motion.span
                        className="text-orange-600 font-bold"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.8,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        ₹{(() => {
                          const subtotal = cartSummary ? parseFloat(cartSummary.totalPrice.toString()) : getTotalPrice();
                          const delivery = selectedOption === "delivery" ? 
                            (cartSummary ? parseFloat(cartSummary.deliveryCharge.toString()) : deliveryCharges) : 0;
                          return (subtotal + delivery).toFixed(2);
                        })()}
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Delivery Options */}
              <motion.div
                className="space-y-3 sm:space-y-4"
                variants={itemVariants}
              >
                {/* Delivery Option */}
                <motion.div
                  className={`bg-white rounded-xl p-4 sm:p-6 cursor-pointer border transition-all duration-300 ${
                    selectedOption === "delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                  variants={cardVariants}
                  animate={
                    selectedOption === "delivery" ? "selected" : "unselected"
                  }
                  onClick={() => setSelectedOption("delivery")}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <motion.div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0 ${
                        selectedOption === "delivery"
                          ? "bg-orange-100"
                          : "bg-zinc-100"
                      }`}
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HomeIcon
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${
                          selectedOption === "delivery"
                            ? "text-orange-600"
                            : "text-zinc-600"
                        }`}
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 flex items-center">
                          <span className="mr-1">Delivery</span>
                          <span className="text-sm sm:text-base">🏠</span>
                          <AnimatePresence>
                            {selectedOption === "delivery" && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2"
                              >
                                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </h3>
                        <div className="flex items-center text-zinc-600 flex-shrink-0">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs sm:text-sm">20-30 mins</span>
                        </div>
                      </div>

                      <p className="text-zinc-600 mb-2 text-sm sm:text-base">
                        Get your order delivered directly to your hostel room
                      </p>

                      <div className="flex items-center text-xs sm:text-sm text-zinc-500">
                        <TruckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>
                          Doorstep Delivery • Perfect for late night cravings
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Dine In Option */}
                <motion.div
                  className={`bg-white rounded-xl p-4 sm:p-6 cursor-pointer border transition-all duration-300 ${
                    selectedOption === "dinein"
                      ? "border-orange-500 bg-orange-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                  variants={cardVariants}
                  animate={
                    selectedOption === "dinein" ? "selected" : "unselected"
                  }
                  onClick={() => setSelectedOption("dinein")}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <motion.div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0 ${
                        selectedOption === "dinein"
                          ? "bg-orange-100"
                          : "bg-zinc-100"
                      }`}
                      whileHover={{ rotate: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BuildingStorefrontIcon
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${
                          selectedOption === "dinein"
                            ? "text-orange-600"
                            : "text-zinc-600"
                        }`}
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 flex items-center">
                          <span className="mr-1">Dine In</span>
                          <span className="text-sm sm:text-base">🍽️</span>
                          <AnimatePresence>
                            {selectedOption === "dinein" && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2"
                              >
                                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </h3>
                        <div className="flex items-center text-zinc-600 flex-shrink-0">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs sm:text-sm">10-15 mins</span>
                        </div>
                      </div>

                      <p className="text-zinc-600 mb-2 text-sm sm:text-base">
                        Enjoy your meal in our cozy café atmosphere
                      </p>

                      <div className="flex items-center text-xs sm:text-sm text-zinc-600">
                        <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>
                          🪑 Choose your table • Study-friendly environment
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Continue Button */}
              <motion.div className="mt-6 sm:mt-8" variants={itemVariants}>
                <motion.button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-lg cursor-pointer"
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleContinue}
                >
                  Continue to{" "}
                  {selectedOption === "delivery" ? "Delivery" : "Dine"}
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {selectedOption === "delivery" ? (
                // Delivery Address Form
                <>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-300">
                      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4 sm:mb-6">
                        Delivery Address
                      </h2>

                      {/* General Error Message */}
                      {validationErrors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validationErrors.general}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* First Name and Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Rahul"
                              value={formData.firstName}
                              onChange={(e) => {
                                handleInputChange("firstName", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, firstName: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.firstName ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.firstName && (
                              <p className="mt-1 text-sm text-red-600">First name is required</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Dash"
                              value={formData.lastName}
                              onChange={(e) => {
                                handleInputChange("lastName", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, lastName: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.lastName ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.lastName && (
                              <p className="mt-1 text-sm text-red-600">Last name is required</p>
                            )}
                          </div>
                        </div>

                        {/* Hostel Input */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Hostel Name *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="e.g., Hostel A - Boys"
                              value={formData.hostel}
                              onChange={(e) => {
                                handleInputChange("hostel", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, hostel: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.hostel ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.hostel && (
                              <p className="mt-1 text-sm text-red-600">Hostel name is required</p>
                            )}
                          </div>
                        </div>

                        {/* Room Number and Floor */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                              Room Number *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 205"
                              value={formData.roomNumber}
                              onChange={(e) => {
                                handleInputChange("roomNumber", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, roomNumber: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.roomNumber ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.roomNumber && (
                              <p className="mt-1 text-sm text-red-600">Room number is required</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                              Floor *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 2nd Floor"
                              value={formData.floor}
                              onChange={(e) => {
                                handleInputChange("floor", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, floor: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.floor ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.floor && (
                              <p className="mt-1 text-sm text-red-600">Floor is required</p>
                            )}
                          </div>
                        </div>

                        {/* Phone Number */}
                       <div>
  <label className="block text-sm font-medium text-zinc-700 mb-2">
    Phone Number *
  </label>
  <input
    type="tel"
    placeholder="Enter 10-digit number (e.g., 1234567890)"
    value={formData.phoneNumber}
    onChange={(e) => {
      // Strip all non-digits and limit to 10 characters
      const rawValue = e.target.value.replace(/\D/g, '').slice(0, 10);
      handleInputChange("phoneNumber", rawValue);

      // Validate (exactly 10 digits)
      const isValid = rawValue.length === 10;
      setValidationErrors({
        ...validationErrors,
        phoneNumber: !isValid,
      });
    }}
    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${
      validationErrors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-zinc-300'
    } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
  />
  {validationErrors.phoneNumber && (
    <p className="mt-1 text-sm text-red-600">
      {!formData.phoneNumber
        ? "Phone number is required"
        : "Must be exactly 10 digits (no symbols)"}
    </p>
  )}
</div>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">
                            Delivery Information
                          </h3>
                          <div className="space-y-2 text-xs sm:text-sm text-purple-800">
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>
                                Estimated delivery time: 20-30 minutes
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>
                                Our delivery person will call you when they
                                arrive
                              </span>
                            </div>
                            <p className="text-xs text-purple-700 mt-2">
                              * Please ensure someone is available to receive
                              the order at the specified location. Delivery
                              charges may apply based on distance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Dine In Form
                <>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-xl p-4 sm:p-6 border border-zinc-300">
                      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4 sm:mb-6">
                        Enter Details
                      </h2>

                      {/* General Error Message */}
                      {validationErrors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {validationErrors.general}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* First Name and Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Rahul"
                              value={formData.firstName}
                              onChange={(e) => {
                                handleInputChange("firstName", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, firstName: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.firstName ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.firstName && (
                              <p className="mt-1 text-sm text-red-600">First name is required</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Dash"
                              value={formData.lastName}
                              onChange={(e) => {
                                handleInputChange("lastName", e.target.value);
                                if (e.target.value) setValidationErrors({...validationErrors, lastName: false});
                              }}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.lastName ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                            />
                            {validationErrors.lastName && (
                              <p className="mt-1 text-sm text-red-600">Last name is required</p>
                            )}
                          </div>
                        </div>

                        {/* Phone Number */}
                       <div>
  <label className="block text-sm font-medium text-zinc-700 mb-2">
    Phone Number *
  </label>
  <input
    type="tel"
    placeholder="Enter 10-digit phone number"
    value={formData.phoneNumber}
    onChange={(e) => {
      // Only allow digits and limit to 10 characters
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      handleInputChange("phoneNumber", value);
      
      // Validate exactly 10 digits
      const isValid = value.length === 10;
      
      setValidationErrors({
        ...validationErrors, 
        phoneNumber: !isValid
      });
    }}
    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${
      validationErrors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-zinc-300'
    } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
  />
  {validationErrors.phoneNumber && (
    <p className="mt-1 text-sm text-red-600">
      {formData.phoneNumber ? 'Please enter exactly 10 digits' : 'Phone number is required'}
    </p>
  )}
</div>

                        {/* Table Number */}
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Table Number *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., T-05"
                            value={formData.tableNumber}
                            onChange={(e) => {
                              handleInputChange("tableNumber", e.target.value);
                              if (e.target.value) setValidationErrors({...validationErrors, tableNumber: false});
                            }}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border ${validationErrors.tableNumber ? 'border-red-500 bg-red-50' : 'border-zinc-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                          />
                          {validationErrors.tableNumber && (
                            <p className="mt-1 text-sm text-red-600">Table number is required</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 space-y-4">
                <motion.button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-lg cursor-pointer"
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </motion.button>
                
                <motion.button
                  className="w-full bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 text-base sm:text-lg cursor-pointer"
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleBack}
                >
                  Back to Order Summary
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Info */}
        <motion.div
          className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-zinc-500"
          variants={itemVariants}
        >
          <p>You can change your order until it's confirmed</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
