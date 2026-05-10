'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { User } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
  const { userData } = useAuth();

  const [open, setOpen] = useState(false);
  const [hasOrderUpdate, setHasOrderUpdate] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  // 🔔 Real-time order update listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip initial load (prevent false notification)
      if (isFirstLoad) {
        setIsFirstLoad(false);
        return;
      }

      let hasUpdate = false;

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          hasUpdate = true;
        }
      });

      if (hasUpdate) {
        setHasOrderUpdate(true);
      }
    });

    return () => unsubscribe();
  }, [user, isFirstLoad]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />

          <div className="leading-tight">
            <h1 className="text-base sm:text-xl font-bold tracking-tight">
              <span className="text-black">Deckta</span>
              <span style={{ color: '#2787b4' }}>G</span>
              <span style={{ color: '#2787b4' }}>o</span>
            </h1>
            <p className="hidden sm:block text-xs text-slate-500">
              Pacific Equities,Inc
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-6 relative">
          {/* 🛒 CART (ALWAYS VISIBLE) */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-[#2787b4] transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500  text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {/* 📦 ORDERS */}
              <Link
                href="/orders"
                className="relative"
                onClick={() => setHasOrderUpdate(false)}
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-[#2787b4] transition" />
                {hasOrderUpdate && (
                  <span className="absolute -top-2 -right-1 bg-red-500 w-3 h-3 rounded-full" />
                )}
              </Link>

              {/* 👤 ACCOUNT */}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setOpen(!open)}>
                 <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
  {userData?.photoURL ? (
    <img
      src={userData.photoURL}
      alt="profile"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <svg
      className="w-full h-full text-gray-400 mt-1"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )}
</div>
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
                        onClick={() => {
                          setOpen(false);
                          setHasOrderUpdate(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          Orders
                        </div>
                        {hasOrderUpdate && (
                          <span className="bg-red-500 w-2.5 h-2.5 rounded-full" />
                        )}
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
                          <span className="bg-red-500  text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                        router.push('/login');
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
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <button className="border border-[#2787b4] text-[#2787b4] hover:bg-[#2787b4] hover:text-white rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base transition font-medium whitespace-nowrap">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-[#2787b4] text-white hover:bg-[#1f6f94] rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base transition font-medium whitespace-nowrap">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}