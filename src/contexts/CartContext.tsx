"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  addToCart as apiAddToCart, 
  getCartItems, 
  updateCartItemQuantity, 
  removeCartItem, 
  convertApiCartToUiCart
} from '@/api/Cart/page';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  category: string;
  originalId?: string; // Original MongoDB ID for API calls
}

interface CartItem extends MenuItem {
  quantity: number;
  originalId: string; // Original MongoDB ID for API calls
  packagingCost?: number; // Packaging cost per item
}

interface CartSummary {
  totalPrice: string;
  gst: string;
  deliveryCharge: string;
  totalWithExtras: string;
  packagingCost?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  cartSummary: CartSummary;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    totalPrice: "0.00",
    gst: "0.00",
    deliveryCharge: "0.00",
    totalWithExtras: "0.00",
    packagingCost: "0.00"
  });
  
  // Helper function to update cart summary from API response
  const updateCartSummaryFromResponse = (cartData: any) => {
    if (cartData && cartData.result) {
      // Calculate packaging cost from cart items
      let packagingCost = "0.00";
      if (cartData.result.cart && cartData.result.cart.items) {
        const totalPackaging = cartData.result.cart.items.reduce((total: number, item: any) => {
          const itemPackagingCost = item.menuId?.packagingCost || 0;
          return total + (itemPackagingCost * item.quantity);
        }, 0);
        packagingCost = totalPackaging.toFixed(2);
      }
      
      setCartSummary({
        totalPrice: cartData.result.totalPrice || "0.00",
        gst: cartData.result.gst || "0.00",
        deliveryCharge: cartData.result.deliveryCharge || "0.00",
        totalWithExtras: cartData.result.totalWithExtras || "0.00",
        packagingCost: packagingCost
      });
    }
  };

  // Fetch cart items on initial load
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const cartData = await getCartItems();
        const formattedCart = convertApiCartToUiCart(cartData);
        setCartItems(formattedCart);
        
        // Update cart summary data
        updateCartSummaryFromResponse(cartData);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (item: MenuItem) => {
    const originalId = item.originalId || item.id.toString();
    
    // Optimistically update UI
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1, originalId } as CartItem]);
    }
    setIsCartOpen(true);

    // Make API call
    try {
      await apiAddToCart(originalId, existingItem ? existingItem.quantity + 1 : 1);
      // Refresh cart after update
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary data from API response
      updateCartSummaryFromResponse(cartData);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // If API call fails, refresh cart to sync with server
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary even in error case to stay in sync
      updateCartSummaryFromResponse(cartData);
    }
  };

  const removeFromCart = async (itemId: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    // Optimistically update UI
    setCartItems(cartItems.filter(item => item.id !== itemId));

    // Make API call
    try {
      await removeCartItem(item.originalId);
      
      // Refresh cart to get updated totals
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary data from API response
      updateCartSummaryFromResponse(cartData);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      // If API call fails, refresh cart to sync with server
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary even in error case
      updateCartSummaryFromResponse(cartData);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    // Optimistically update UI
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }

    // Make API call
    try {
      await updateCartItemQuantity(item.originalId, newQuantity);
      
      // Refresh cart to get updated totals
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary data from API response
      updateCartSummaryFromResponse(cartData);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // If API call fails, refresh cart to sync with server
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary even in error case
      updateCartSummaryFromResponse(cartData);
    }
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const refreshCart = async () => {
    try {
      const cartData = await getCartItems();
      const formattedCart = convertApiCartToUiCart(cartData);
      setCartItems(formattedCart);
      
      // Update cart summary data
      updateCartSummaryFromResponse(cartData);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  };

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    isLoading,
    cartSummary,
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
