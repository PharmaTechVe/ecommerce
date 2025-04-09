import type { Metadata } from 'next';
import theme from '../styles/styles';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Pharmatech',
  description: 'La farmacia más grande de Venezuela',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={theme.poppins.variable}>
      <body>
        <Suspense>
          <AuthProvider>
            <CartProvider>
              {children}
              <ToastContainer />
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
