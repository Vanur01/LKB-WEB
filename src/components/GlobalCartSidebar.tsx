"use client";
import React from "react";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";

const GlobalCartSidebar = () => {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity,
    isLoading,
    cartSummary
  } = useCart();

  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={closeCart}
      cartItems={cartItems}
      onRemoveFromCart={removeFromCart}
      onUpdateQuantity={updateQuantity}
      isLoading={isLoading}
      cartSummary={cartSummary}
    />
  );
};

export default GlobalCartSidebar;
