'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTutorial } from '@/hooks/useTutorial';
import { useState } from 'react';
import { Search } from "lucide-react";
const statusColors: Record<string, string> = {
  Pending: 'bg-[#e6f2f8] text-[#2787b4]',
  'In Production': 'bg-[#e6f2f8] text-[#2787b4]',
  'In Transit': 'bg-[#e6f2f8] text-[#2787b4]',
  'Out for Delivery': 'bg-[#e6f2f8] text-[#2787b4]',
  Delivered: 'bg-[#e6f2f8] text-[#2787b4]',
};
const normalizedStatusMap: Record<string, string> = {
  pending: 'Pending',
  in_production: 'In Production',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export default function OrdersPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { orders: realOrders, loading: ordersLoading } = useOrders();
  const router = useRouter();
  const { isTutorialActive, demoOrder } = useTutorial();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // 🔥 Demo mode: inject Firestore-fetched demo order
  const orders = isTutorialActive ? [demoOrder as any] : realOrders;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  const filteredOrders = orders.filter((order) => {
  const matchesSearch = order.id
    .toLowerCase()
    .includes(search.toLowerCase());


const displayStatus =
  normalizedStatusMap[order.status] || order.status;

const matchesStatus =
  filterStatus === 'All' ||
  displayStatus === filterStatus;

  return matchesSearch && matchesStatus;
});

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2787b4] mx-auto mb-4"></div>
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
              <Button className="bg-[#2787b4] hover:bg-[#1f6f94] text-white">Log In</Button>
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
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
  <div className="relative flex-1">
  <Search
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    size={18}
  />

  <input
    type="text"
    placeholder="Search Order ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-lg px-4 pr-10 py-2 w-full"
  />
</div>

  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="border rounded-lg px-4 py-2"
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Production">In Production</option>
    <option value="In Transit">In Transit</option>
    <option value="Out for Delivery">Out for Delivery</option>
    <option value="Delivered">Delivered</option>
  </select>
</div>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">No orders yet</p>
            <p className="text-slate-500 mb-6">Start shopping to place your first order</p>
            <Link href="/">
              <Button className="bg-[#2787b4] hover:bg-[#1f6f94] text-white">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card
  id={orders.indexOf(order) === 0 ? 'order-card' : undefined}
  className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[order.status] || 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {normalizedStatusMap[order.status] || order.status}
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
                    <div className="text-left sm:text-right">
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
