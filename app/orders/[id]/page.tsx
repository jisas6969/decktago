'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Order } from '@/hooks/useOrders';
import { useTutorial } from '@/hooks/useTutorial';

// ✅ STEPS
const statusSteps = [
  'Pending',
  'In Production',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

// ✅ COLORS
const statusColors: Record<string, string> = {
  Pending: 'bg-[#e6f2f8] text-[#2787b4]',
  'In Production': 'bg-[#e6f2f8] text-[#2787b4]',
  'In Transit': 'bg-[#e6f2f8] text-[#2787b4]',
  'Out for Delivery': 'bg-[#e6f2f8] text-[#2787b4]',
  Delivered: 'bg-[#e6f2f8] text-[#2787b4]',
};


// ✅ STATUS MAP
const statusMap: Record<string, string> = {
  ready_for_processing: 'Pending',
  pending: 'Pending',

  production: 'In Production',
  in_production: 'In Production',

  transit: 'In Transit',
  in_transit: 'In Transit',

  delivery: 'Out for Delivery',
  out_for_delivery: 'Out for Delivery',

  delivered: 'Delivered',
};

export default function OrderDetailPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isTutorialActive, demoOrder } = useTutorial();

  // ✅ FIXED PARAMS (NO ERROR)
  const params = useParams();
  const orderId = params.id as string;

  // 🔥 Demo mode: use fake order data
  useEffect(() => {
    if (isTutorialActive && orderId === 'demo-order') {
      setOrder(demoOrder as any);
      setLoading(false);
      return;
    }
  }, [isTutorialActive, orderId]);

  // 🔥 REAL-TIME LISTENER (skip for demo)
  useEffect(() => {
    if (!user || !orderId) return;
    if (isTutorialActive && orderId === 'demo-order') return;

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
      if (!docSnap.exists()) {
        setError('Order not found');
        setLoading(false);
        return;
      }

      const data = docSnap.data();

      if (data.userId !== user.uid) {
        setError('No permission');
        setLoading(false);
        return;
      }

      setOrder({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Order);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, orderId, isTutorialActive]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // 🔄 LOADING
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-[#2787b4] rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login">
          <Button className="bg-[#2787b4]  text-white">
  Login
</Button>
        </Link>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-10 text-center text-red-600">
        {error || 'Order not found'}
      </div>
    );
  }
  const total = order.items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

  // ✅ SAFE STATUS
  const normalizedStatus = statusMap[order.status] || 'Pending';

  const currentStatusIndex = Math.max(
    0,
    statusSteps.indexOf(normalizedStatus)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* BACK */}
        <Link href="/orders" className="mb-8 inline-block">
          <Button variant="outline">← Back to Orders</Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">

              {/* HEADER */}
              <div className="flex justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">
                    Order #{order.id.slice(0, 8)}
                  </h1>
                  <p className="text-slate-600">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <span
  className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center ${
    statusColors[normalizedStatus]
  }`}
>
  {normalizedStatus}
</span>
              </div>

              {/* TRACKING */}
              <div id="tracking-progress" className="mb-8">
                <h2 className="font-semibold mb-4">Tracking Progress</h2>

                <div className="space-y-4">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStatusIndex;

                    return (
                      <div key={step} className="flex gap-4">

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                              isActive ? 'bg-[#2787b4]' : 'bg-gray-300'
                            }`}
                          >
                            {index < currentStatusIndex ? '✓' : index + 1}
                          </div>

                          {index < statusSteps.length - 1 && (
                            <div
                              className={`w-1 h-12 ${
                                index < currentStatusIndex
                                  ? 'bg-[#2787b4]'
                                  : 'bg-gray-300'
                              }`}
                            />
                          )}
                        </div>

                        <div>
                          <p className={isActive ? '' : 'text-gray-400'}>
                            {step}
                          </p>

                          {index === currentStatusIndex && (
                            <p className="text-sm text-[#2787b4]">
                              Current status
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ITEMS */}
              <div>
                <h2 className="font-semibold mb-4">Order Items</h2>

                <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                  <div>Product</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Subtotal</div>
                </div>

                {order.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center text-sm border-b last:border-none py-2">

                    <div>
                      <p className="font-medium">{item.name}</p>
                    </div>

                    <div className="text-center">
                      {item.quantity} kg
                    </div>

                    <div className="text-right font-medium">
                      ₱ {(item.price * item.quantity).toLocaleString()}
                    </div>

                  </div>
                ))}
              </div>

            </Card>
          </div>

          {/* RIGHT */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="font-bold mb-4">Order Summary</h2>

              <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Subtotal</div>
              </div>

              <div className="space-y-0 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center text-sm border-b last:border-none pb-2 mb-2">

                    <div>{item.name}</div>

                    <div className="text-center">
                      {item.quantity} kg
                    </div>

                    <div className="text-right font-medium">
                      ₱ {(item.price * item.quantity).toLocaleString()}
                    </div>

                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-[#2787b4]">
                  ₱ {total.toLocaleString()}
                </span>
              </div>


              <div className="text-sm text-gray-600">
  <p>{order.shippingAddress.fullName}</p>

  <p>
  {order.shippingAddress.street && `${order.shippingAddress.street}, `}
  {order.shippingAddress.barangay}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
</p>


  <p>{order.shippingAddress.phone}</p>
</div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}