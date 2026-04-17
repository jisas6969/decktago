'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from './useOrders';

interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  totalOrdersValue: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  recentOrders: Order[];
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    totalOrders: 0,
    totalOrdersValue: 0,
    averageOrderValue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get orders that are "Out for Delivery" or "Delivered" for sales
      const salesQuery = query(
        collection(db, 'orders'),
        where('status', 'in', ['Out for Delivery', 'Delivered'])
      );

      const unsubscribeSales = onSnapshot(
        salesQuery,
        (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Order[];

          const totalSalesValue = orders.reduce((sum, order) => sum + order.total, 0);

          setMetrics((prev) => ({
            ...prev,
            totalSales: totalSalesValue,
            completedOrders: orders.length,
          }));
        },
        (err) => console.error('Error fetching sales:', err)
      );

      // Get all orders
      const allOrdersQuery = query(collection(db, 'orders'));

      const unsubscribeAllOrders = onSnapshot(
        allOrdersQuery,
        (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Order[];

          const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
          const avgValue = orders.length > 0 ? totalValue / orders.length : 0;
          const pending = orders.filter((o) => o.status === 'Pending').length;
          const recent = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

          setMetrics((prev) => ({
            ...prev,
            totalOrders: orders.length,
            totalOrdersValue: totalValue,
            averageOrderValue: avgValue,
            pendingOrders: pending,
            recentOrders: recent,
          }));

          setLoading(false);
        },
        (err) => {
          console.error('Error fetching orders:', err);
          setError('Failed to load dashboard metrics');
          setLoading(false);
        }
      );

      return () => {
        unsubscribeSales();
        unsubscribeAllOrders();
      };
    } catch (err) {
      setError('Failed to setup dashboard listener');
      setLoading(false);
    }
  }, []);

  return { metrics, loading, error };
}
