'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { User } from 'firebase/auth';
import { ShoppingCart, Package, User as UserIcon, Settings, LogOut } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Decktago
        </Link>

        <div className="flex items-center gap-6 relative">
          {user && (
            <>
              {/* 🛒 CART ICON */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* 📦 ORDERS ICON */}
              <Link href="/orders">
                <Package className="w-6 h-6 text-gray-700 hover:text-blue-600" />
              </Link>

              {/* 👤 ACCOUNT DROPDOWN */}
              <div className="relative">
                <button onClick={() => setOpen(!open)}>
                  <UserIcon className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">

                    <Link href="/account">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <UserIcon size={16} />
                        Profile
                      </div>
                    </Link>

                    <Link href="/orders">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Package size={16} />
                        Orders
                      </div>
                    </Link>

                    <Link href="/settings">
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Settings size={16} />
                        Settings
                      </div>
                    </Link>

                    <div
                      onClick={onLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      <LogOut size={16} />
                      Logout
                    </div>

                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}