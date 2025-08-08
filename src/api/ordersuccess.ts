// API Types for Order Success
export interface OrderItem {
  menuId: string;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface DeliveryDetails {
  firstName: string;
  lastName: string;
  hostel: string;
  roomNumber: string;
  floor: string;
  phone: string;
}

export interface DineInDetails {
  firstName: string;
  lastName: string;
  tableNumber: string;
  phone: string;
}

export interface OrderDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryCharges: number;
    gstAmount: number;
    grandTotal: number;
    orderType: 'delivery' | 'dinein';
    deliveryDetails?: DeliveryDetails;
    dineInDetails?: DineInDetails;
    isPaid: boolean;
    paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
    status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    orderId: string;
    paymentSessionId: string;
    returnUrl: string;
    transactionId: string;
    notifyUrl: string;
    __v: number;
  };
}

export interface OrderStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Array<{
    auth_id: string | null;
    authorization: string | null;
    bank_reference: string;
    cf_payment_id: number;
    entity: string;
    error_details?: {
      error_code: string;
      error_description: string;
      error_reason: string;
      error_source: string;
      error_code_raw: string;
      error_description_raw: string;
      error_subcode_raw: string;
    };
    is_captured: boolean;
    order_amount: number;
    order_id: string;
    payment_amount: number;
    payment_completion_time: string;
    payment_currency: string;
    payment_gateway_details: {
      gateway_name: string;
      gateway_order_id: string;
      gateway_payment_id: string;
      gateway_order_reference_id: string;
      gateway_status_code: string;
      gateway_settlement: string;
    };
    payment_group: string;
    payment_message: string;
    payment_method: {
      card: {
        card_bank_name: string;
        card_country: string;
        card_network: string;
        card_network_reference_id: string | null;
        card_number: string;
        card_sub_type: string;
        card_type: string;
        channel: string;
      };
    };
    payment_offers: any;
    payment_status: 'SUCCESS' | 'FAILED' | 'PENDING';
    payment_time: string;
  }>;
}

// Define base URL for the API
const API_BASE_URL = "http://localhost:9001/api/v1";

/**
 * Fetch order details by order ID
 * @param orderId - The order ID to fetch details for
 * @returns Promise<OrderDetailsResponse>
 */
export const getOrderDetails = async (orderId: string): Promise<OrderDetailsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/orderDetails/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OrderDetailsResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch order details');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

/**
 * Fetch order status by order ID
 * @param orderId - The order ID to fetch status for
 * @returns Promise<OrderStatusResponse>
 */
export const getOrderStatus = async (orderId: string): Promise<OrderStatusResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/orderStatus/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OrderStatusResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch order status');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  }
};


/**
 * Utility function to format date
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status color based on order status
 * @param status - Order status
 * @returns Tailwind CSS color class
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'confirmed':
      return 'text-blue-600 bg-blue-100';
    case 'preparing':
      return 'text-orange-600 bg-orange-100';
    case 'delivered':
      return 'text-green-600 bg-green-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Get payment status color
 * @param paymentStatus - Payment status
 * @returns Tailwind CSS color class
 */
export const getPaymentStatusColor = (paymentStatus: string): string => {
  switch (paymentStatus.toUpperCase()) {
    case 'SUCCESS':
      return 'text-green-600 bg-green-100';
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-100';
    case 'FAILED':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
