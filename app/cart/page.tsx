'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, removeItem, updateQuantity, updateUnit } = useCart();
  const router = useRouter();

  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const toggleSelect = (id: string) => {
  setSelectedItems((prev) =>
    prev.includes(id)
      ? prev.filter((i) => i !== id)
      : [...prev, id]
  );
};
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

const handleSelectAll = () => {
  if (isAllSelected) {
    setSelectedItems([]);
  } else {
    setSelectedItems(items.map(item => item.id));
  }
};
  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
  <p className="text-slate-600">Review and manage your items before checkout</p>
</div>
<div className="flex items-center gap-3 mb-3 px-2">

  {/* ✅ SELECT ALL */}
  <input
    type="checkbox"
    checked={isAllSelected}
    onChange={handleSelectAll}
    className="w-4 h-4 accent-[#2787b4]"
  />

  <span className="text-sm font-medium">Select All</span>

</div>

        {items.length === 0 ? (
  <Card className="p-12 text-center">

    <p className="text-slate-600 text-lg mb-4">
      Your cart is empty
    </p>

    <p className="text-slate-500 mb-6">
      Start shopping to add items to your cart
    </p>

    <Link href="/">
      <Button className="bg-[#2787b4] hover:bg-[#1f6f94] text-white">
        Continue Shopping
      </Button>
    </Link>

  </Card>
) : (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* 🛒 LEFT - ITEMS */}
            <div className="lg:col-span-2 space-y-4">

              {items.map((item) => (
                <Card key={item.id} className="p-4">

                  <div className="flex gap-4 items-center">

  {/* ✅ CHECKBOX */}
  <input
    type="checkbox"
    checked={selectedItems.includes(item.id)}
    onChange={() => toggleSelect(item.id)}
    className="w-4 h-4 accent-[#2787b4]"
  />

  {/* IMAGE */}
  <img
    src={item.image || '/placeholder.png'}
    className="w-20 h-20 object-cover rounded border"
  />

  {/* DETAILS */}
                    <div className="flex-1">

                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      {/* UNIT + QUANTITY */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">

                        {/* UNIT SELECT */}
                        <select
                          value={item.unit || 'box'}
                          onChange={(e) => updateUnit(item.id, e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                        >
                          <option value="box">Box</option>
                          <option value="pack">Pack</option>
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
                          className="px-3 border rounded"
                        >
                          -
                        </button>

                        {/* INPUT */}
                        <input
                          type="number"
                          step={item.unit === 'kg' ? '0.5' : '1'}
                          value={tempValues[item.id] ?? item.quantity}
                          onChange={(e) =>
                            setTempValues({
                              ...tempValues,
                              [item.id]: e.target.value,
                            })
                          }
                          onBlur={() => {
                            const val = Number(tempValues[item.id]);
                            if (val > 0) updateQuantity(item.id, val);

                            const copy = { ...tempValues };
                            delete copy[item.id];
                            setTempValues(copy);
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
                          className="px-3 border rounded"
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm mt-2"
                      >
                        Remove
                      </button>

                    </div>
                  </div>

                </Card>
              ))}

            </div>

            {/* 🧾 RIGHT - SUMMARY */}
            <div>
              <Card className="p-5 sticky top-20">

                <h2 className="font-bold mb-4">Order Summary</h2>

                <div className="space-y-3">

                  {items
  .filter((item) => selectedItems.includes(item.id))
  .map((item) => (
                    <div key={item.id} className="flex items-center gap-2">

                      {/* IMAGE */}
                      <img
                        src={item.image || '/placeholder.png'}
                        className="w-10 h-10 rounded object-cover"
                      />

                      {/* NAME */}
                      <div className="flex-1 text-sm">
                        {item.name}
                      </div>

                      {/* QTY */}
                      <div className="text-sm font-medium">
                        {item.quantity} {item.unit}
                      </div>

                    </div>
                  ))}

                </div>

                {selectedItems.length > 0 ? (
  <Link
  href={{
    pathname: "/checkout",
    query: { selected: JSON.stringify(selectedItems) },
  }}
>
    <Button className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white">
      Proceed to Checkout
    </Button>
  </Link>
) : (
  <Button disabled className="w-full">
    Select items first
  </Button>
)}

<Link href="/">
  <Button
    variant="outline"
    className="w-full mt-3"
  >
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