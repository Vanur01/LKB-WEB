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
          <div className="text-center mb-6">
            <p className="text-lg text-green-600 font-semibold">Order #{order._id}</p>
            <p className="text-gray-600">Payment Amount: {formatCurrency(paymentDetails.payment_amount)}</p>
            <p className="text-sm text-gray-500">Transaction ID: {paymentDetails.cf_payment_id}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Payment Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Payment Method:</span>
                <span className="text-green-800 font-medium">{paymentDetails.payment_method.card.card_type.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Card:</span>
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
          <div className="text-center mb-6">
            <p className="text-lg text-red-600 font-semibold">Order #{order._id}</p>
            <p className="text-gray-600">Payment Amount: {formatCurrency(paymentDetails.payment_amount)}</p>
            <p className="text-sm text-gray-500">Transaction ID: {paymentDetails.cf_payment_id}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">Failure Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700">Error Code:</span>
                <span className="text-red-800 font-medium">{paymentDetails.error_details?.error_code || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Reason:</span>
                <span className="text-red-800 font-medium">{paymentDetails.error_details?.error_reason || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Payment Time:</span>
                <span className="text-red-800 font-medium">{formatDate(paymentDetails.payment_completion_time)}</span>
              </div>
            </div>
            <p className="text-red-700 text-sm mt-3">
              {paymentDetails.error_details?.error_description || 'Payment was declined by your bank.'}
            </p>
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
          <div className="text-center mb-6">
            <p className="text-lg text-yellow-600 font-semibold">Order #{order._id}</p>
            <p className="text-gray-600">Payment Amount: {formatCurrency(paymentDetails?.payment_amount || order.grandTotal)}</p>
            {paymentDetails && (
              <p className="text-sm text-gray-500">Transaction ID: {paymentDetails.cf_payment_id}</p>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ClockIcon className="w-12 h-12 text-yellow-600" />
              </motion.div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Payment Status:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Order Created</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-sm text-gray-600">Processing Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-400">Payment Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-400">Order Confirmed</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Refresh Status
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
