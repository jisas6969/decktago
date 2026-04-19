'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Production': 'bg-blue-100 text-blue-800',
  'In Transit': 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  Delivered: 'bg-green-100 text-green-800',
};

export default function OrdersPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const router = useRouter();

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
            <p className="text-lg text-slate-600 mb-8">You need to log in to view your orders</p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-slate-600">View and track your orders</p>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">No orders yet</p>
            <p className="text-slate-500 mb-6">Start shopping to place your first order</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[order.status] || 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">
                        {order.createdAt instanceof Date
                          ? order.createdAt.toLocaleDateString()
                          : new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-slate-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">View details →</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
