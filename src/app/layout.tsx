import type { Metadata } from 'next';
import theme from '../styles/styles';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
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
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer></ToastContainer>
      </body>
    </html>
  );
}
