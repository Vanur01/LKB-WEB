import { v4 as uuidv4 } from 'uuid';

// Define base URL for the API
const API_BASE_URL = "https://api.orderfood.coffee/api/v1";

// Session ID management
const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  let sessionId = localStorage.getItem('x-session-id');
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('x-session-id', sessionId);
  }
  
  return sessionId || '';
};

// API Types
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  isAvailable: boolean;
  packagingCost?: number;
}

export interface CartItemResponse {
  menuId: MenuItem;
  quantity: number;
  _id: string;
}

export interface CartResponse {
  _id: string;
  sessionId: string;
  items: CartItemResponse[];
  createdAt: string;
  __v: number;
}

export interface GetCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    totalPrice: string;
    gst: string;
    deliveryCharge: string;
    totalWithExtras: string;
    cart: CartResponse;
  };
}

// Add to cart
export const addToCart = async (menuId: string, quantity: number): Promise<boolean> => {
  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/cart/addToCartItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        menuId,
        quantity,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

// Get cart items
export const getCartItems = async (): Promise<GetCartResponse | null> => {
  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/cart/getCartItems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    const data: GetCartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  menuId: string,
  quantity: number
): Promise<boolean> => {
  try {
    // First check if quantity is 0, if so, we should remove the item
    if (quantity <= 0) {
      return removeCartItem(menuId);
    }
    
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/cart/updateCartItem`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        menuId,
        quantity,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update cart item quantity');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return false;
  }
};

// Remove item from cart
export const removeCartItem = async (menuId: string): Promise<boolean> => {
  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/cart/removeCartItem`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        menuId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
};

// Convert API response to CartItem format for the UI
export const convertApiCartToUiCart = (apiResponse: GetCartResponse | null) => {
  if (!apiResponse || !apiResponse.result || !apiResponse.result.cart || !apiResponse.result.cart.items) {
    return [];
  }
  
  return apiResponse.result.cart.items.map((item) => {
    // Ensure menuId exists and has an _id property before trying to access it
    const menuId = item.menuId || {};
    const id = menuId._id ? parseInt(menuId._id.slice(-6), 16) : Math.floor(Math.random() * 100000);
    
    return {
      id,
      originalId: menuId._id || '', // Keep the original ID for API calls
      name: menuId.name || 'Unknown Item',
      description: menuId.description || '',
      price: menuId.price || 0,
      image: menuId.image || '',
      isVeg: menuId.isVeg || false,
      category: menuId.category || '',
      quantity: item.quantity || 0,
      packagingCost: menuId.packagingCost || 0, // Add packaging cost
    };
  });
};

// Order API interfaces
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

export interface OrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    paymentUrl?: string; // PhonePe redirect URL may be present at root
    order: {
      items: {
        menuId: string;
        name: string;
        quantity: number;
        price: number;
        _id: string;
      }[];
      totalAmount: number;
      deliveryCharges: number;
      gstAmount: number;
      grandTotal: number;
      orderType: string;
      deliveryDetails?: DeliveryDetails;
      dineInDetails?: DineInDetails;
      isPaid: boolean;
      paymentStatus: string;
      status: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      orderId: string;
      // Cashfree legacy fields (kept optional for backward compatibility)
      paymentSessionId?: string;
      transactionId?: string;
      returnUrl?: string;
      notifyUrl?: string;
      // PhonePe redirect URL may also be nested here
      paymentUrl?: string;
    }
  };
}

// Create an order
export const createOrder = async (
  orderType: 'delivery' | 'dinein',
  details: DeliveryDetails | DineInDetails
): Promise<OrderResponse | null> => {
  try {
    const sessionId = getSessionId();
    
    // Create request body with exact structure expected by the API
    let requestBody: any = {
      orderType
    };
    
    if (orderType === 'delivery') {
      requestBody.deliveryDetails = details as DeliveryDetails;
    } else {
      requestBody.dineInDetails = details as DineInDetails;
    }
    
    console.log('Sending order request:', JSON.stringify(requestBody));
    
    const response = await fetch(`${API_BASE_URL}/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Order creation failed with status:', response.status);
      console.error('Error response:', data);
      throw new Error(`Failed to create order: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Delivery Settings API interfaces
export interface DeliverySettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    _id: string;
    isDeliveryEnabled: boolean;
    __v: number;
  };
}

// Get delivery settings
export const getDeliverySettings = async (): Promise<DeliverySettingsResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/getDeliverySettings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to fetch delivery settings with status:', response.status);
      console.error('Error response:', data);
      throw new Error(`Failed to fetch delivery settings: ${data.message || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching delivery settings:', error);
    return null;
  }
};


