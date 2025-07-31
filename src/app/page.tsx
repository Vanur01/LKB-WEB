"use client";
import React from 'react'
import HeroSection from '@/components/Home/HeroSection'
import { useCart } from '@/contexts/CartContext'

const HomePage = () => {
  const { getTotalItems, openCart } = useCart();

  return (
    <div>
      <HeroSection 
        cartCount={getTotalItems()} 
        onCartClick={openCart}
      />
    </div>
  )
}

export default HomePage