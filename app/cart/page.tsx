'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { items, removeItem, updateQuantity, updateUnit} = useCart();
  const router = useRouter();
  const [tempValues, setTempValues] = useState<Record<string, string>>({});

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
            <p className="text-lg text-slate-600 mb-8">You need to log in to view your cart</p>
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4 text-lg">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                        <img
  src={item.image && item.image.trim() ? item.image : '/placeholder.png'}
  alt={item.name || 'Product'}
  className="w-full h-full object-cover"
  onError={(e) => {
    (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
  }}
/>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  
                        <div className="flex items-center gap-4 mb-2">

  {/* ✅ NEW: Box / Packs */}
<select
  value={item.unit || 'box'}
  onChange={(e) => updateUnit(item.id, e.target.value)}
  className="border px-2 py-1 rounded"
>
  <option value="box">Box</option>
  <option value="packs">Packs</option>
  <option value="kg">Kg</option> {/* ✅ NEW */}
</select>

  {/* ➖ */}
  <button
    onClick={() =>
  updateQuantity(
    item.id,
    item.quantity - (item.unit === 'kg' ? 0.5 : 1)
  )
}
    className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100"
  >
    -
  </button>

  {/* quantity */}
  <input
  type="number"
  step={item.unit === 'kg' ? '0.5' : '1'}
  min="0"
  value={tempValues[item.id] ?? item.quantity}
  onChange={(e) => {
    const value = e.target.value;

    // allow empty habang nagtatype
    setTempValues((prev) => ({
      ...prev,
      [item.id]: value,
    }));
  }}
  onBlur={() => {
    const raw = tempValues[item.id];

    if (raw !== undefined && raw !== '') {
      const value = Number(raw);

      if (!isNaN(value) && value > 0) {
        updateQuantity(item.id, value);
      }
    }

    // reset temp value
    setTempValues((prev) => {
      const copy = { ...prev };
      delete copy[item.id];
      return copy;
    });
  }}
  className="w-16 text-center border rounded appearance-none"
/>

  {/* ➕ */}
  <button
    onClick={() =>
  updateQuantity(
    item.id,
    item.quantity + (item.unit === 'kg' ? 0.5 : 1)
  )
}
    className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100"
  >
    +
  </button>

</div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">

  {items.map((item) => (
    <div key={item.id} className="flex justify-between text-sm">
  <span className="text-slate-600">
    {item.name} ({item.unit === 'kg' ? 'kg' : item.unit || 'box'})
  </span>
  <span className="font-medium">
    {item.quantity}
  </span>
</div>
  ))}

</div>
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white">
  Proceed to Checkout
</Button>
                </Link>
                <Link href="/" className="block mt-2">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
