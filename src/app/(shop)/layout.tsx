'use client';

import { useState, ReactNode } from 'react';
import NavBar from '@/components/Navbar';
import CartOverlay from '@/components/Cart/CartOverlay';
import Footer from '@/components/Footer';

type ShopLayoutProps = {
  children: ReactNode;
};

export default function ShopLayout({ children }: ShopLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="relative bg-white">
        {/* Nav */}
        <div className="relative z-50">
          <NavBar onCartClick={() => setIsCartOpen(true)} />
        </div>
        {children}
      </div>
      <Footer />
      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} closeCart={() => setIsCartOpen(false)} />
    </div>
  );
}
