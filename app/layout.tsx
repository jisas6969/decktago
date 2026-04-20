import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ChatWidget from '@/components/ChatWidget';
import ClientLayout from './ClientLayout';


export const metadata = {
  title: 'Decktago',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>

              {/* ✅ NASA LOOB NA NG PROVIDERS */}
              <ClientLayout>{children}</ClientLayout>
              <ChatWidget /> 

            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}