'use client';

import { ReactNode } from 'react';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ShopLayoutProps = {
  children: ReactNode;
};

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div>
      <div className="relative bg-white">
        {/* Nav */}
        <div className="relative z-50">
          <NavBar />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
}
