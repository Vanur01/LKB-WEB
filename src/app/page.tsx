"use client";
import React, { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import HeroSection from '@/components/Home/HeroSection'
import { useCart } from '@/contexts/CartContext'

const HomePageContent = () => {
  const { getTotalItems, openCart } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) {
      localStorage.setItem('tableNumber', table);
    }
  }, [searchParams]);

  return (
    <div>
      <HeroSection
        cartCount={getTotalItems()}
        onCartClick={openCart}
      />
    </div>
  )
}

const HomePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}

export default HomePage