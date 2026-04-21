import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ChatWidget from '@/components/ChatWidget';
import ClientLayout from './ClientLayout';
import { Toaster } from "@/components/ui/toaster";

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

            <ClientLayout>{children}</ClientLayout>

            {/* ✅ REQUIRED for toast */}
            <Toaster />

            <ChatWidget /> 

          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}