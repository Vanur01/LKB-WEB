"use client";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  TruckIcon,
  HomeIcon,
  PhoneIcon,
  ClockIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import {
  getOrderDetails,
  formatCurrency,
  formatDate,
  getStatusColor,
  getPaymentStatusColor,
  type OrderDetailsResponse
} from "@/api/ordersuccess";

const OrderConfirmed = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = searchParams.get('order_id');

        if (!orderId) {
          setError('Order ID not found in URL');
          setLoading(false);
          return;
        }

        console.log('Fetching order details for:', orderId);
        const details = await getOrderDetails(orderId);
        setOrderDetails(details);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => window.location.href = '/menu'}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  const { result: order } = orderDetails;
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-zinc-100"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Confirmation Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl overflow-hidden mb-6 border-1 border-zinc-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5"></div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10"
            >
              <CheckCircleIcon className="w-16 h-16 mx-auto text-white drop-shadow-lg" />
              <motion.h1
                className="text-3xl font-bold text-white mt-4 mb-2"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Order Confirmed!
              </motion.h1>
              <motion.p
                className="text-orange-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Thank you{" "}
                <span className="font-semibold text-white">
                  {order.deliveryDetails?.firstName || order.dineInDetails?.firstName} {order.deliveryDetails?.lastName || order.dineInDetails?.lastName}
                </span>
                , your order is being prepared
              </motion.p>
            </motion.div>
          </div>

          {/* Order Details */}
          <div className="p-6">
            {/* Order ID */}
            <motion.div
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between bg-orange-50 rounded-xl p-4 mb-6"
            >
              <div>
                <p className="text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Order Number
                </p>
                <p className="text-lg font-bold text-orange-600">{order._id}</p>
              </div>
              <div className="bg-white border-1 border-zinc-300 p-3 rounded-lg">
                <ClockIcon className="w-5 h-5 text-orange-500" />
              </div>
            </motion.div>

            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex gap-4 mb-6"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-2">Order Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-2">Payment Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={item._id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery/Dine Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="space-y-6 mb-6"
            >
              {order.orderType === 'delivery' && order.deliveryDetails ? (
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                    <HomeIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Room Delivery
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {order.deliveryDetails.hostel} / Room {order.deliveryDetails.roomNumber}
                      {order.deliveryDetails.floor && ` / ${order.deliveryDetails.floor}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Phone: {order.deliveryDetails.phone}
                    </p>
                  </div>
                </div>
              ) : order.orderType === 'dinein' && order.dineInDetails ? (
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                    <BuildingStorefrontIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Dine In
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Table: {order.dineInDetails.tableNumber}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Phone: {order.dineInDetails.phone}
                    </p>
                  </div>
                </div>
              ) : null}



              {order.orderType === 'delivery' && (
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                    <TruckIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Estimated Time
                        </h3>
                        <p className="text-gray-600 text-sm">
                          20-30 minutes
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordered: {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <p className="font-medium text-orange-600 text-xs">
                          {order.status === 'pending' ? 'Preparing' : order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Bill Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-800">{formatCurrency(order.deliveryCharges)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST</span>
                <span className="text-gray-800">{formatCurrency(order.gstAmount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-orange-600">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </motion.div>

            {/* Total */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl p-4 border border-orange-100"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-700">
                  {order.isPaid ? 'Total Paid' : 'Total Amount'}
                </h3>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 mr-1">
                    INR
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatCurrency(order.grandTotal)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={() => window.location.href = '/menu'}
            className="relative overflow-hidden group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-full shadow-md transition-all duration-300 transform hover:scale-[1.02] w-full max-w-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <HomeIcon className="w-5 h-5" />
            Continue Shopping
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
          </button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl p-6 border-1 border-zinc-200"
        >
          <div className="text-center space-y-2">
            <p className="text-zinc-600 text-sm">
              {order.orderType === 'delivery'
                ? 'Our delivery person will call you when they arrive'
                : 'Your order will be ready for pickup at the specified table'
              }
            </p>
            <p className="text-sm text-zinc-600">
              Need help? Call
              <span className="font-bold text-zinc-700"> +91 98765 43210</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-4"
        >
          <p className="text-xs text-gray-500 italic text-center">
            "Great things take time... but not too much time! 😊"
          </p>
        </motion.div>
      </div>


    </motion.main>
  );
};

const OrderConfirmedPage = () => {
  return (
    <Suspense fallback={<div className='min-h-screen bg-zinc-100 flex items-center justify-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div></div>}>
      <OrderConfirmed />
    </Suspense>
  );
};

export default OrderConfirmedPage;
