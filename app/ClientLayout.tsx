'use client';

import Navigation from '@/components/Navigation';
import { useAuth } from './context/AuthContext';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // 🚫 pages na walang navbar
  const hideNavbar =
    pathname === '/login' ||
    pathname === '/signup';

  return (
    <>
      {/* 🔥 CONDITIONAL NAVBAR */}
      {!hideNavbar && (
        <Navigation user={user} onLogout={logout} />
      )}

      <main>{children}</main>
    </>
  );
}