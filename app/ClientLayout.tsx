'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from './context/AuthContext';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // 🚫 pages na walang navbar/footer
  const hideNavbarRoutes = ['/login', '/signup', '/forgot-password'];

  const hideNavbar = hideNavbarRoutes.some((route) =>
    pathname.includes(route)
  );

  const hideFooter = hideNavbarRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <>
      {/* 🔥 CONDITIONAL NAVBAR */}
      {!hideNavbar && (
        <Navigation user={user} onLogout={logout} />
      )}

      <main>{children}</main>

      {/* 🔥 FOOTER */}
      {!hideFooter && (
        <Footer />
      )}
    </>
  );
}