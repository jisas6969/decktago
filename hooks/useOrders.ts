'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';

export interface Order {
  id: string;
  userId: string;
  items: Array<{
  id: string;
  name: string;
  quantity: number;
  unit?: 'box' | 'packs' | 'kg';
}>
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'Pending' | 'In Production' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  createdAt: Date;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const ordersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Order[];
          setOrders(ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching orders:', err);
          setError('Failed to load orders');
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      setError('Failed to setup orders listener');
      setLoading(false);
    }
  }, [user]);

  return { orders, loading, error };
}
