'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [search, setSearch] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

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
      quantity: 1,
      image: product.imageUrl,
      unit: 'box',
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

                  <p className="text-sm text-gray-500 mb-3">
                    {product.type} • {product.category}
                  </p>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#2787b4] hover:bg-[#1f6f94] text-white"
                  >
                    Add to Cart
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