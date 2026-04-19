'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function HomePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState('');

  // 🔥 NEW STATES (SEARCH + FILTER)
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return;

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setFullName(snap.data().fullName);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [user]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: 0,
      quantity: 1,
      image: product.imageUrl,
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchesType =
      selectedType === 'All' || product.type === selectedType;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-lg text-slate-600 mb-8">Please log in to continue shopping</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {fullName || user.email}
          </h1>
          <p className="text-slate-600">
            Browse our products and add them to your cart
          </p>
        </div>

        {/* 🔍 SEARCH + 🥩 FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full md:w-1/3"
          />

          <div className="flex gap-2 flex-wrap">
  {['All', 'Beef', 'Chicken', 'Pork'].map((type) => (
    <button
      key={type}
      onClick={() => setSelectedType(type)}
      className={`px-4 py-2 rounded-lg border transition ${
        selectedType === type
          ? 'text-white'
          : 'bg-white text-gray-700'
      }`}
      style={{
        backgroundColor: selectedType === type ? '#2787b4' : 'white',
        borderColor: '#2787b4',
      }}
    >
      {type}
    </button>
  ))}
</div>

        </div>

        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">

                <ProductImage src={product.imageUrl || '/placeholder.png'} />

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

                  <p className="text-slate-600 text-sm mb-3">
                    {product.type} • {product.defaultWeight ?? 'N/A'}g
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ₱0.00
                    </span>

                    <span className="text-sm text-slate-500">
                      Available
                    </span>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full h-12 text-sm font-semibold text-white rounded-xl bg-[#2787b4] hover:bg-[#1f6f94]"
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