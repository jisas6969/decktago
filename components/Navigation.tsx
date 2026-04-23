'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { User } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Package,
  User as UserIcon,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const { items } = useCart();
  const cartCount = items.length;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 object-contain"
          />

          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-black">Deckta</span>
              <span style={{ color: '#2787b4' }}>G</span>
              <span style={{ color: '#2787b4' }}>o</span>
            </h1>
            <p className="text-xs text-slate-500">
              Pacific Equities
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6 relative">
          {user && (
            <>
              {/* 🛒 CART */}
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#2787b4] transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2787b4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* 📦 ORDERS */}
              <Link href="/orders">
                <Package className="w-6 h-6 text-gray-700 hover:text-[#2787b4] transition" />
              </Link>

              {/* 👤 ACCOUNT */}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setOpen(!open)}>
                  <UserIcon className="w-6 h-6 text-gray-700 hover:text-[#2787b4] transition" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">

                    <Link href="/account">
                      <div
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <UserIcon size={16} />
                        Profile
                      </div>
                    </Link>

                    <Link href="/orders">
                      <div
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Package size={16} />
                        Orders
                      </div>
                    </Link>

                    {/* 🛒 CART */}
                    <Link href="/cart">
                      <div
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingCart size={16} />
                          Cart
                        </div>

                        {cartCount > 0 && (
                          <span className="bg-[#2787b4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* LOGOUT */}
                    <div
                      onClick={() => {
                        setOpen(false);
                        onLogout();
                      }}
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