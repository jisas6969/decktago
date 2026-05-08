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
  price: number; // ✅ ADD THIS
  quantity: number;
  image?: string;
  unit?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // 🔥 REAL-TIME SYNC & MERGE GUEST CART
  useEffect(() => {
    if (!user) {
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        try {
          setItems(JSON.parse(guestCart));
        } catch (e) {
          setItems([]);
        }
      } else {
        setItems([]);
      }
      return;
    }

    const mergeGuestCart = async () => {
      const guestCartStr = localStorage.getItem('guest_cart');
      if (guestCartStr) {
        try {
          const guestCart: CartItem[] = JSON.parse(guestCartStr);
          if (guestCart.length > 0) {
            const cartRef = doc(db, 'carts', user.uid);
            const snap = await getDoc(cartRef);
            let currentItems: CartItem[] = snap.exists() ? snap.data().items || [] : [];
            
            guestCart.forEach((gItem) => {
              const existing = currentItems.find((i) => i.id === gItem.id);
              if (existing) {
                existing.quantity += gItem.quantity;
              } else {
                currentItems.push(gItem);
              }
            });
            
            await setDoc(cartRef, { items: currentItems }, { merge: true });
          }
        } catch (e) {
          console.error('Failed to merge guest cart', e);
        }
        localStorage.removeItem('guest_cart');
      }
    };
    mergeGuestCart();

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


  // ✅ ADD ITEM
  const addItem = async (product: CartItem) => {
    if (!user) {
      const guestCartStr = localStorage.getItem('guest_cart');
      let currentItems: CartItem[] = guestCartStr ? JSON.parse(guestCartStr) : [];
      const existing = currentItems.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += product.quantity;
      } else {
        currentItems.push({
          id: product.id || '',
          name: product.name || 'Unknown',
          price: product.price || 0,
          quantity: product.quantity,
          image: product.image || '/placeholder.png',
          unit: 'kg', 
        });
      }
      localStorage.setItem('guest_cart', JSON.stringify(currentItems));
      setItems([...currentItems]);
      return;
    }

    const cartRef = doc(db, 'carts', user.uid);
    const snap = await getDoc(cartRef);

    let currentItems: CartItem[] = snap.exists()
      ? snap.data().items || []
      : [];

    const existing = currentItems.find((i) => i.id === product.id);

    if (existing) {
      existing.quantity += product.quantity;
    } else {
      currentItems.push({
  id: product.id || '',
  name: product.name || 'Unknown',
  price: product.price || 0, // ✅ IMPORTANT
  quantity: product.quantity,
  image: product.image || '/placeholder.png',
  unit: 'kg', 
});
    }

    await setDoc(cartRef, { items: currentItems }, { merge: true });
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) {
      const guestCartStr = localStorage.getItem('guest_cart');
      let currentItems: CartItem[] = guestCartStr ? JSON.parse(guestCartStr) : [];
      if (quantity <= 0) {
        currentItems = currentItems.filter((item) => item.id !== id);
      } else {
        currentItems = currentItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      localStorage.setItem('guest_cart', JSON.stringify(currentItems));
      setItems([...currentItems]);
      return;
    }

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
    if (!user) {
      const guestCartStr = localStorage.getItem('guest_cart');
      let currentItems: CartItem[] = guestCartStr ? JSON.parse(guestCartStr) : [];
      currentItems = currentItems.filter((item) => item.id !== id);
      localStorage.setItem('guest_cart', JSON.stringify(currentItems));
      setItems([...currentItems]);
      return;
    }

    const cartRef = doc(db, 'carts', user.uid);
    const snap = await getDoc(cartRef);

    if (!snap.exists()) return;

    const updated = snap.data().items.filter((item: CartItem) => item.id !== id);

    await setDoc(cartRef, { items: updated }, { merge: true });
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem('guest_cart');
      setItems([]);
      return;
    }

    await setDoc(doc(db, 'carts', user.uid), { items: [] });
  };

  return (
    <CartContext.Provider
      value={{
        items,
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