'use client';

import Navigation from '@/components/Navigation';
import { useAuth } from './context/AuthContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* ✅ Navbar always visible */}
      <Navigation user={user} onLogout={logout} />

      {/* ✅ Page content */}
      <main>{children}</main>
    </>
  );
}