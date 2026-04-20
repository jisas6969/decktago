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
  const { items, removeItem, updateQuantity, updateUnit } = useCart();
  const router = useRouter();
  const [tempValues, setTempValues] = useState<Record<string, string>>({});

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2787b4]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login">
          <Button className="bg-[#2787b4] text-white">Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-[#2787b4] text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 🛒 ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">

                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* IMAGE */}
                    <div className="w-full sm:w-24 h-40 sm:h-24 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image && item.image.trim() ? item.image : '/placeholder.png'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.name}
                      </h3>

                      {/* CONTROLS */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">

                        {/* UNIT */}
                        <select
                          value={item.unit || 'box'}
                          onChange={(e) => updateUnit(item.id, e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                        >
                          <option value="box">Box</option>
                          <option value="packs">Packs</option>
                          <option value="kg">Kg</option>
                        </select>

                        {/* - */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - (item.unit === 'kg' ? 0.5 : 1)
                            )
                          }
                          className="px-3 py-1 border rounded"
                        >
                          -
                        </button>

                        {/* INPUT */}
                        <input
                          type="number"
                          step={item.unit === 'kg' ? '0.5' : '1'}
                          min="0"
                          value={tempValues[item.id] ?? item.quantity}
                          onChange={(e) =>
                            setTempValues((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          onBlur={() => {
                            const raw = tempValues[item.id];
                            if (raw !== undefined && raw !== '') {
                              const value = Number(raw);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value);
                              }
                            }

                            setTempValues((prev) => {
                              const copy = { ...prev };
                              delete copy[item.id];
                              return copy;
                            });
                          }}
                          className="w-16 text-center border rounded"
                        />

                        {/* + */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + (item.unit === 'kg' ? 0.5 : 1)
                            )
                          }
                          className="px-3 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                </Card>
              ))}
            </div>

            {/* 🧾 SUMMARY */}
            <div>
              <Card className="p-5 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} ({item.unit})
                      </span>
                      <span>{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" className="w-full mt-2">
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