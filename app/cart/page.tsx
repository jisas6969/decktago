'use client';
import { Trash2 } from "lucide-react";
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTutorial } from '@/hooks/useTutorial';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { items: realItems, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const { isTutorialActive, demoCartItem } = useTutorial();

  // 🔥 Demo mode: inject Firestore-fetched demo product
  const items = isTutorialActive ? [demoCartItem] : realItems;

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
  const total = items
  .filter(item => selectedItems.includes(item.id))
  .reduce((sum, item) => sum + (item.price * item.quantity), 0);
const handleDeleteSelected = async () => {
  for (const id of selectedItems) {
    await removeItem(id);
  }
  setSelectedItems([]);
};
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
{items.length > 1 && (
  <div className="flex items-center mb-3 px-2">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={isAllSelected}
      onChange={handleSelectAll}
      className="w-4 h-4 accent-[#2787b4]"
    />

    <span className="text-sm font-medium">Select All</span>
  </div>

  {/* RIGHT SIDE */}
  <div className="ml-auto mr-107">
  {selectedItems.length > 1 && (
    <button
      onClick={handleDeleteSelected}
      className="text-red-500 hover:text-red-600 text-sm font-medium"
    >
      Delete All
    </button>
  )}
</div>

</div>
)}

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
                <Card id={items.indexOf(item) === 0 ? 'cart-item-demo' : undefined} key={item.id} className="p-4 relative">
                  <button
  onClick={() => removeItem(item.id)}
   className="absolute top-3 right-3 text-red-500 hover:text-red-600"
  title="Remove item"
  disabled={isTutorialActive}
  style={isTutorialActive ? { opacity: 0.3, pointerEvents: 'none' } : {}}
>
  <Trash2 className="w-5 h-5" />
</button>

                  <div className="flex gap-4 items-center">

  {/* ✅ CHECKBOX */}
  <input
    id={items.indexOf(item) === 0 ? 'cart-checkbox' : undefined}
    type="checkbox"
    checked={isTutorialActive ? true : selectedItems.includes(item.id)}
    onChange={() => !isTutorialActive && toggleSelect(item.id)}
    disabled={isTutorialActive}
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
                      <p className="text-sm text-gray-600">
  ₱ {Number(item.price).toLocaleString()} / kg
</p>

<p className="text-sm font-medium">
  Total: ₱ {(Number(item.price) * Number(item.quantity)).toLocaleString()}
</p>

                      {/* UNIT + QUANTITY */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">

                        {/* UNIT SELECT */}
                        <p className="text-sm">Unit: kg</p>

                        {/* - */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - (0.5)
                            )
                          }
                          className="px-3 border rounded"
                        >
                          -
                        </button>

                        {/* INPUT */}
                        <input
                          type="number"
                          step="0.5"
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
                              item.quantity + (0.5)
                            )
                          }
                          className="px-3 border rounded"
                        >
                          +
                        </button>

                      </div>

                      

                    </div>
                  </div>

                </Card>
              ))}

            </div>

            {/* 🧾 RIGHT - SUMMARY */}
            <div>
              <Card className="p-5 sticky top-20">

                <h2 className="font-bold mb-4">Order Summary</h2>

                {/* Header Row */}
                <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                  <div>Product</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Subtotal</div>
                </div>

                <div className="space-y-0">

                  {items
  .filter((item) => selectedItems.includes(item.id))
  .map((item) => (
                    <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center text-sm border-b last:border-none pb-2 mb-2">

                      {/* IMAGE + NAME */}
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image || '/placeholder.png'}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>{item.name}</span>
                      </div>

                      {/* QUANTITY */}
                      <div className="text-center">
                        {item.quantity} kg
                      </div>

                      {/* SUBTOTAL */}
                      <div className="text-right font-medium">
                        ₱ {(item.price * item.quantity).toLocaleString()}
                      </div>

                    </div>
                  ))}

                </div>
                <div className="border-t pt-3 mt-4">
  <div className="flex justify-between font-bold text-lg">
    <span>Total</span>
    <span className="text-[#2787b4] font-bold">
  ₱ {total.toLocaleString()}
</span>
  </div>
</div>

                {selectedItems.length > 0 ? (
  <Link
  href={{
    pathname: "/checkout",
    query: { selected: JSON.stringify(selectedItems) },
  }}
>
    <Button id="checkout-btn" className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white">
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