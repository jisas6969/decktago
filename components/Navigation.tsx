'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Store
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link href="/cart">
                <Button variant="outline" className="relative">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline">Orders</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button onClick={onLogout} variant="ghost">
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
