'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle } from "lucide-react";
import { useTutorial } from '@/hooks/useTutorial';

export default function HomePage() {
  const { startTutorial, isTutorialActive } = useTutorial();
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [inventory, setInventory] = useState<Record<string, number>>({});
  useEffect(() => {
  const fetchInventory = async () => {
    const snap = await getDocs(collection(db, 'inventory'));

    const map: Record<string, number> = {};

    snap.forEach((doc) => {
      const data = doc.data();
      map[data.product_id] = data.stock;
    });

    setInventory(map);
  };

  fetchInventory();
}, []);


useEffect(() => {
  const checkTutorial = async () => {
    if (!user?.uid) return;

    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      if (!data.hasSeenTutorial) {
        startTutorial(); // 🔥 instant show
      }
    }
  };

  checkTutorial();
}, [user, startTutorial]);

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // 👤 Fetch user name
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFullName(snap.data().fullName);
      }
    };

    fetchUser();
  }, [user]);

  const handleAddToCart = (product: any) => {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantities[product.id] ?? 1,
    image: product.imageUrl,
    unit: 'kg',
  });

  // ✅ RESET AFTER ADD
  setQuantities((prev) => ({
    ...prev,
    [product.id]: 1,
  }));

  toast({
    duration: 1500,
    description: (
      <div className="flex flex-col items-center gap-2">
        <CheckCircle className="w-10 h-10 text-[#2787b4]" />
        <span className="text-sm font-medium text-white">
          Added to cart
        </span>
      </div>
    ),
  });
};

  // 🔥 GROUP DATA
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const typesByCategory: Record<string, string[]> = {};

  products.forEach((p) => {
    if (!typesByCategory[p.category]) {
      typesByCategory[p.category] = [];
    }

    if (!typesByCategory[p.category].includes(p.type)) {
      typesByCategory[p.category].push(p.type);
    }
  });

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    const matchesType =
      selectedType === 'All' || product.type === selectedType;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2787b4]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {fullName || user.email}
          </h1>
          <p className="text-slate-600">
            Browse our products and add them to your cart
          </p>
        </div>

        {/* 🔍 SEARCH + DROPDOWN FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
          />

          {/* 🟦 CATEGORY */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedType('All'); // reset type
            }}
            className="border px-4 py-2 rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* 🟩 TYPE */}
          {selectedCategory !== 'All' && (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="All">All</option>

              {typesByCategory[selectedCategory]?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* PRODUCTS */}
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2787b4]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">

                <ProductImage src={product.imageUrl || '/placeholder.png'} />

                <div className="p-4">
  <h3 className="font-semibold text-lg mb-2">
    {product.name}
  </h3>

  <p className="text-sm text-gray-500 mb-1">
    {product.type} • {product.category}
  </p>

  {/* 💰 PRICE */}
  <p className="text-sm text-gray-700">
    ₱{product.price ?? 0}
  </p>


{/* 📦 STATUS */}
<p className={`text-sm font-medium mb-2 ${
  (inventory[product.id] ?? 0) > 0 ? "text-green-500" : "text-red-500"
}`}>
  {(inventory[product.id] ?? 0) > 0 ? "Available" : "Unavailable"}
</p>
<div className="flex items-center gap-2 mb-3">

  <span className="text-sm">Unit: kg</span>

  {/* - */}
  <button
    id={filteredProducts.indexOf(product) === 0 ? 'quantity-minus' : undefined}
    onClick={() =>
      setQuantities((prev) => ({
        ...prev,
        [product.id]: Math.max((prev[product.id] ?? 1) - 0.5, 0.5),
      }))
    }
    disabled={isTutorialActive}
    className="px-3 border rounded disabled:opacity-50"
  >
    -
  </button>

  {/* VALUE */}
  <input
  type="number"
  step="0.5"
  value={tempValues[product.id] ?? quantities[product.id] ?? 1}
  onChange={(e) =>
    setTempValues({
      ...tempValues,
      [product.id]: e.target.value,
    })
  }
  onBlur={() => {
    const val = Number(tempValues[product.id]);

    if (val >= 0.5) {
      setQuantities((prev) => ({
        ...prev,
        [product.id]: val,
      }));
    }

    const copy = { ...tempValues };
    delete copy[product.id];
    setTempValues(copy);
  }}
  className="w-16 text-center border rounded"
/>

  {/* + */}
  <button
    id={filteredProducts.indexOf(product) === 0 ? 'quantity-plus' : undefined}
    onClick={() =>
      setQuantities((prev) => ({
        ...prev,
        [product.id]: (prev[product.id] ?? 1) + 0.5,
      }))
    }
    disabled={isTutorialActive}
    className="px-3 border rounded disabled:opacity-50"
  >
    +
  </button>

</div>


  <Button
  id={filteredProducts.indexOf(product) === 0 ? 'add-to-cart-btn' : undefined}
  onClick={() => handleAddToCart(product)}
  disabled={isTutorialActive || (inventory[product.id] ?? 0) === 0}
  className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white disabled:bg-gray-400"
>
  {(inventory[product.id] ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
</Button>
</div>
              </Card>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}