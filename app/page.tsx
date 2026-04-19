'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<<<<<<< HEAD
// 🔥 NEW IMPORTS
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
=======
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976

export default function HomePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

<<<<<<< HEAD
  // 🔥 NEW STATE
  const [fullName, setFullName] = useState('');

  // 🔥 FETCH USER FULL NAME
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

=======
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
<<<<<<< HEAD
      price: 0,
      quantity: 1,
      image: product.imageUrl,
=======
      price: product.price,
      quantity: 1,
      image: product.image,
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
    });
  };

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
<<<<<<< HEAD
          {/* 🔥 FIXED HERE */}
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {fullName || user.email}
          </h1>

=======
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.email}</h1>
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
          <p className="text-slate-600">Browse our products and add them to your cart</p>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No products available yet</p>
            <p className="text-sm text-slate-500">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
<<<<<<< HEAD

                <div className="aspect-square bg-slate-200 overflow-hidden">
                  <img
                    src={product.imageUrl || '/placeholder.png'}
=======
                <div className="aspect-square bg-slate-200 overflow-hidden">
                  <img
                    src={product.image}
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
<<<<<<< HEAD

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
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
=======
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-500">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add to Cart
                  </Button>
                </div>
<<<<<<< HEAD

=======
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
