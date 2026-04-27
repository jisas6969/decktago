'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id: string;
  name: string;
  type: string;
  category: string;
  price: number; // 💰 ADD
  stock: number; // 🔢 ADD
  imageUrl?: string | null;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
  id: doc.id,
  name: data.name || '',
  type: data.type || '',
  category: data.category || '',
  price: data.price ?? 0,   // 💰 ADD
  stock: data.stock ?? 0,   // 🔢 ADD
  imageUrl: data.imageUrl ?? null,
};
        });

        setProducts(productsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}