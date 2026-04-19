'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // 🔥 REAL-TIME
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const cartRef = doc(db, 'carts', user.uid);

    const unsub = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        setItems(snap.data().items || []);
      } else {
        setItems([]);
      }
    });

    return () => unsub();
  }, [user]);

  // ✅ TOTAL
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ ADD ITEM
  const addItem = async (product: CartItem) => {
  if (!user) return;

  const cartRef = doc(db, 'carts', user.uid);
  const snap = await getDoc(cartRef);

  let currentItems: CartItem[] = snap.exists()
    ? snap.data().items || []
    : [];

  const existing = currentItems.find((i) => i.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    currentItems.push({
      id: product.id || '',
      name: product.name || 'Unknown',
      price: product.price || 0,
      quantity: 1,
      image: product.image || '/placeholder.png', // ✅ FIX
    });
  }

  await setDoc(cartRef, { items: currentItems }, { merge: true });
};

  // ✅ UPDATE QUANTITY 🔥 (FIX)
  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    const cartRef = doc(db, 'carts', user.uid);
    const snap = await getDoc(cartRef);

    if (!snap.exists()) return;

    let currentItems: CartItem[] = snap.data().items || [];

    if (quantity <= 0) {
      currentItems = currentItems.filter((item) => item.id !== id);
    } else {
      currentItems = currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    }

    await setDoc(cartRef, { items: currentItems }, { merge: true });
  };

  // ✅ REMOVE ITEM
  const removeItem = async (id: string) => {
    if (!user) return;

    const cartRef = doc(db, 'carts', user.uid);
    const snap = await getDoc(cartRef);

    if (!snap.exists()) return;

    const updated = snap.data().items.filter((item: CartItem) => item.id !== id);

    await setDoc(cartRef, { items: updated }, { merge: true });
  };

  // ✅ CLEAR
  const clearCart = async () => {
    if (!user) return;

    await setDoc(doc(db, 'carts', user.uid), { items: [] });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};