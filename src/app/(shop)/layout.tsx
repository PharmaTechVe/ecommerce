'use client';

import { ReactNode } from 'react';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

type ShopLayoutProps = {
  children: ReactNode;
};

export default function ShopLayout({ children }: ShopLayoutProps) {
  const { isLoading } = useAuth();

  if (isLoading) return null;

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
