'use client';

import { ReactNode, Suspense } from 'react';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Loading from '../loading';

type ShopLayoutProps = {
  children: ReactNode;
};

export default function ShopLayout({ children }: ShopLayoutProps) {
  const { isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative flex flex-1 flex-col bg-white">
        {/* Nav */}
        <div className="sticky top-0 z-50 bg-white">
          <NavBar />
        </div>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
      <Footer />
    </div>
  );
}
