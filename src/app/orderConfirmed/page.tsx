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
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import {
  getOrderDetails,
  getOrderStatus,
  formatCurrency,
  formatDate,
  getStatusColor,
  getPaymentStatusColor,
  type OrderDetailsResponse,
  type OrderStatusResponse
} from "@/api/ordersuccess";

const orderConfirmed = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderId = searchParams.get('order_id');

        if (!orderId) {
          setError('Order ID not found in URL');
          setLoading(false);
          return;
        }

        console.log('Fetching order data for:', orderId);
        
        // Fetch both order details and order status
        const [details, status] = await Promise.all([
          getOrderDetails(orderId),
          getOrderStatus(orderId)
        ]);
        
        setOrderDetails(details);
        setOrderStatus(status);
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !orderDetails || !orderStatus) {
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
  const { result: statusResult } = orderStatus;
  
  // Get the latest payment status from the order status API
  const latestPaymentStatus = statusResult.length > 0 ? statusResult[0].payment_status : 'PENDING';
  
  // Render different modals based on payment status
  return renderPaymentStatusModal(order, latestPaymentStatus, statusResult[0]);
};

// Payment Success Modal Component
const PaymentSuccessModal = ({ order, paymentDetails }: { order: any; paymentDetails: any }) => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-green-50"
  >
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-green-200"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5"></div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10"
          >
            <CheckCircleIcon className="w-20 h-20 mx-auto text-white drop-shadow-lg" />
            <motion.h1
              className="text-4xl font-bold text-white mt-4 mb-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Successful! 🎉
            </motion.h1>
            <motion.p
              className="text-green-100 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your order has been confirmed and payment processed successfully!
            </motion.p>
          </motion.div>
        </div>

        {/* Success Content */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="text-center mb-6">
            <p className="text-lg text-green-600 font-semibold">Order #{order.orderId}</p>
            <p className="text-gray-600">Thank you {order.deliveryDetails?.firstName} {order.deliveryDetails?.lastName}</p>
            <p className="text-sm text-gray-500">Order placed on {formatDate(order.createdAt)}</p>
          </div>

          {/* Payment Details */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-3">💳 Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Amount Paid:</span>
                <span className="text-green-800 font-medium">{formatCurrency(paymentDetails.payment_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Transaction ID:</span>
                <span className="text-green-800 font-medium">{paymentDetails.cf_payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Payment Method:</span>
                <span className="text-green-800 font-medium">{paymentDetails.payment_method.card.card_type.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Card Number:</span>
                <span className="text-green-800 font-medium">{paymentDetails.payment_method.card.card_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Bank:</span>
                <span className="text-green-800 font-medium">{paymentDetails.payment_method.card.card_bank_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Payment Time:</span>
                <span className="text-green-800 font-medium">{formatDate(paymentDetails.payment_completion_time)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">🍽️ Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          {order.orderType === 'delivery' && order.deliveryDetails && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">🚚 Delivery Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.firstName} {order.deliveryDetails.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hostel:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.hostel}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Room:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Floor:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.floor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({order.items.length} items)</span>
                <span className="text-gray-800">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-800">{formatCurrency(order.deliveryCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST</span>
                <span className="text-gray-800">{formatCurrency(order.gstAmount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Grand Total</span>
                  <span className="font-bold text-green-600">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Track Order
            </button>
            <button 
              onClick={() => window.location.href = '/menu'}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Order Again
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.main>
);

// Payment Failed Modal Component
const PaymentFailedModal = ({ order, paymentDetails }: { order: any; paymentDetails: any }) => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-red-50"
  >
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-red-200"
      >
        {/* Failed Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5"></div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10"
          >
            <XCircleIcon className="w-20 h-20 mx-auto text-white drop-shadow-lg" />
            <motion.h1
              className="text-4xl font-bold text-white mt-4 mb-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Failed �
            </motion.h1>
            <motion.p
              className="text-red-100 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Unfortunately, your payment could not be processed.
            </motion.p>
          </motion.div>
        </div>

        {/* Failed Content */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="text-center mb-6">
            <p className="text-lg text-red-600 font-semibold">Order #{order.orderId}</p>
            <p className="text-gray-600">Hi {order.deliveryDetails?.firstName} {order.deliveryDetails?.lastName}</p>
            <p className="text-sm text-gray-500">Order attempted on {formatDate(order.createdAt)}</p>
          </div>

          {/* Payment Failure Details */}
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-3">❌ Payment Failure Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700">Attempted Amount:</span>
                <span className="text-red-800 font-medium">{formatCurrency(paymentDetails.payment_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Transaction ID:</span>
                <span className="text-red-800 font-medium">{paymentDetails.cf_payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Error Code:</span>
                <span className="text-red-800 font-medium">{paymentDetails.error_details?.error_code || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Error Reason:</span>
                <span className="text-red-800 font-medium">{paymentDetails.error_details?.error_reason || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Payment Method:</span>
                <span className="text-red-800 font-medium">{paymentDetails.payment_method?.card?.card_type?.toUpperCase() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Failure Time:</span>
                <span className="text-red-800 font-medium">{formatDate(paymentDetails.payment_completion_time)}</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-red-100 rounded-lg">
              <p className="text-red-700 text-sm">
                <strong>Reason:</strong> {paymentDetails.error_details?.error_description || 'Payment was declined by your bank.'}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">🍽️ Order Items (Payment Pending)</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3 opacity-75">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          {order.orderType === 'delivery' && order.deliveryDetails && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">🚚 Delivery Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 opacity-75">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.firstName} {order.deliveryDetails.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hostel:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.hostel}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Room:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Floor:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.floor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Bill Summary (Payment Required)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({order.items.length} items)</span>
                <span className="text-gray-800">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-800">{formatCurrency(order.deliveryCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST</span>
                <span className="text-gray-800">{formatCurrency(order.gstAmount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Amount to Pay</span>
                  <span className="font-bold text-red-600">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Important Information</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Your order is not confirmed due to payment failure</li>
              <li>• No amount has been deducted from your account</li>
              <li>• You can retry payment or place a new order</li>
              <li>• If any amount was deducted, it will be refunded within 3-5 business days</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Retry Payment
            </button>
            <button 
              onClick={() => window.location.href = '/menu'}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.main>
);

// Payment Pending Modal Component
const PaymentPendingModal = ({ order, paymentDetails }: { order: any; paymentDetails: any }) => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-yellow-50"
  >
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-yellow-200"
      >
        {/* Pending Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5"></div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10"
          >
            <ClockIcon className="w-20 h-20 mx-auto text-white drop-shadow-lg" />
            <motion.h1
              className="text-4xl font-bold text-white mt-4 mb-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Processing ⏳
            </motion.h1>
            <motion.p
              className="text-yellow-100 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your payment is being processed. Please wait...
            </motion.p>
          </motion.div>
        </div>

        {/* Pending Content */}
        <div className="p-6">
          {/* Order Summary */}
          <div className="text-center mb-6">
            <p className="text-lg text-yellow-600 font-semibold">Order #{order.orderId}</p>
            <p className="text-gray-600">Hi {order.deliveryDetails?.firstName} {order.deliveryDetails?.lastName}</p>
            <p className="text-sm text-gray-500">Order placed on {formatDate(order.createdAt)}</p>
          </div>

          {/* Payment Processing Details */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-3">💳 Payment Processing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-yellow-700">Processing Amount:</span>
                <span className="text-yellow-800 font-medium">{formatCurrency(paymentDetails?.payment_amount || order.grandTotal)}</span>
              </div>
              {paymentDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Transaction ID:</span>
                    <span className="text-yellow-800 font-medium">{paymentDetails.cf_payment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Payment Method:</span>
                    <span className="text-yellow-800 font-medium">{paymentDetails.payment_method?.card?.card_type?.toUpperCase() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Processing Time:</span>
                    <span className="text-yellow-800 font-medium">{formatDate(paymentDetails.created_at)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Processing Status */}
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">⏳ Payment Status:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700 font-medium">Order Created</span>
                <div className="flex-1 h-px bg-green-300"></div>
                <span className="text-xs text-green-600">✓</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-4 h-4 rounded-full bg-yellow-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.div>
                <span className="text-sm text-yellow-700 font-medium">Processing Payment</span>
                <div className="flex-1 h-px bg-yellow-300"></div>
                <motion.span 
                  className="text-xs text-yellow-600"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⏳
                </motion.span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-400">Payment Confirmation</span>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400">⏱️</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-400">Order Confirmed</span>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400">📋</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">🍽️ Order Items (Pending Confirmation)</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          {order.orderType === 'delivery' && order.deliveryDetails && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">🚚 Delivery Information</h3>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.firstName} {order.deliveryDetails.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hostel:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.hostel}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Room:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Floor:</span>
                    <span className="ml-2 font-medium">{order.deliveryDetails.floor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Bill Summary (Awaiting Payment)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({order.items.length} items)</span>
                <span className="text-gray-800">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-800">{formatCurrency(order.deliveryCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST</span>
                <span className="text-gray-800">{formatCurrency(order.gstAmount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Processing Amount</span>
                  <span className="font-bold text-yellow-600">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Information */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Processing Information</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Your payment is being processed by our secure payment gateway</li>
              <li>• This usually takes 30-60 seconds to complete</li>
              <li>• Please do not refresh or close this page</li>
              <li>• You will be automatically updated once payment is confirmed</li>
              <li>• If payment fails, you can retry or your money will be refunded</li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ClockIcon className="w-5 h-5" />
            </motion.div>
            Refresh Payment Status
          </button>
        </div>
      </motion.div>
    </div>
  </motion.main>
);

// Function to render appropriate modal based on payment status
const renderPaymentStatusModal = (order: any, paymentStatus: string, paymentDetails: any) => {
  switch (paymentStatus.toUpperCase()) {
    case 'SUCCESS':
      return <PaymentSuccessModal order={order} paymentDetails={paymentDetails} />;
    
    case 'FAILED':
      return <PaymentFailedModal order={order} paymentDetails={paymentDetails} />;
    
    case 'PENDING':
    default:
      return <PaymentPendingModal order={order} paymentDetails={paymentDetails} />;
  }
};

// Create a capitalized alias for JSX usage
const OrderConfirmed = orderConfirmed;

const orderConfirmedPage = () => {
  return (
    <Suspense fallback={<div className='min-h-screen bg-zinc-100 flex items-center justify-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500'></div></div>}>
      <OrderConfirmed />
    </Suspense>
  );
};

export default orderConfirmedPage;
