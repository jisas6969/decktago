'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Order } from '@/hooks/useOrders';

const statusSteps = ['Pending', 'In Production', 'In Transit', 'Out for Delivery', 'Delivered'];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Production': 'bg-blue-100 text-blue-800',
  'In Transit': 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  Delivered: 'bg-green-100 text-green-800',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { user, logout, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!user || !orderId) return;

    try {
      const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
        if (!doc.exists()) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        const data = doc.data();
        if (data.userId !== user.uid) {
          setError('You do not have permission to view this order');
          setLoading(false);
          return;
        }

        setOrder({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Order);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError('Failed to load order');
      setLoading(false);
    }
  }, [user, orderId]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Please Log In</h1>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation user={user} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation user={user} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/orders">
              <Button variant="outline">Back to Orders</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/orders" className="mb-8 inline-block">
          <Button variant="outline">← Back to Orders</Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order #{order.id.slice(0, 8)}</h1>
                  <p className="text-slate-600">
                    Placed on{' '}
                    {order.createdAt instanceof Date
                      ? order.createdAt.toLocaleDateString()
                      : new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                    statusColors[order.status] || 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-4">Tracking Progress</h2>
                <div className="space-y-4">
                  {statusSteps.map((status, index) => (
                    <div key={status} className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            index <= currentStatusIndex
                              ? 'bg-blue-600'
                              : 'bg-slate-300'
                          }`}
                        >
                          {index < currentStatusIndex ? '✓' : index + 1}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              index < currentStatusIndex
                                ? 'bg-blue-600'
                                : 'bg-slate-300'
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p
                          className={`font-semibold ${
                            index <= currentStatusIndex
                              ? 'text-slate-900'
                              : 'text-slate-500'
                          }`}
                        >
                          {status}
                        </p>
                        {index === currentStatusIndex && (
                          <p className="text-sm text-blue-600 mt-1">Current status</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <h2 className="font-semibold text-lg mb-4">Order Items</h2>
                <div className="space-y-4 border-t border-slate-200 pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-slate-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="mb-6 border-b border-slate-200 pb-6">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <p className="text-sm text-slate-700 space-y-1">
                  <div>{order.shippingAddress.fullName}</div>
                  <div>{order.shippingAddress.address}</div>
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </div>
                  <div>{order.shippingAddress.phone}</div>
                  <div>{order.shippingAddress.email}</div>
                </p>
              </div>

              <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
