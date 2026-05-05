import type { Metadata } from 'next';
import './globals.css';

import { Poppins } from 'next/font/google';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ChatWidget from '@/components/ChatWidget';
import ClientLayout from './ClientLayout';
import { Toaster } from "@/components/ui/toaster";
import TutorialOverlay from '@/components/TutorialOverlay';
import { TutorialProvider } from '@/app/context/TutorialContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'DecktaGo',
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
      <body className={poppins.className}>
       <AuthProvider>
  <CartProvider>

    <TutorialProvider> 

      <ClientLayout>
        {children}
        <TutorialOverlay />
      </ClientLayout>

    </TutorialProvider>

    <Toaster />
    <ChatWidget />

  </CartProvider>
</AuthProvider>
      </body>
    </html>
  );
}