'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id: string;
  name: string;
<<<<<<< HEAD
  type: string;
  defaultWeight: number | null;
  imageUrl?: string | null;
=======
  price: number;
  description: string;
  category: string;

>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            name: data.name || '',
            type: data.type || '',
            defaultWeight: data.defaultWeight ?? null, // ✅ FIXED
            imageUrl: data.imageUrl ?? null, // ✅ NEW (for Cloudinary)
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
=======
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const productsData = snapshot.docs.map((doc) => {
  const data = doc.data();

  return {
    id: doc.id,
    name: data.name || '',
    price: Number(data.price) || 0,
    description: data.description || '',
    category: data.category || '',
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

      return unsubscribe;
    } catch (err) {
      setError('Failed to setup product listener');
      setLoading(false);
    }
  }, []);

  return { products, loading, error };
}
>>>>>>> 391da37f7273f4e62b8cd5ec4d5e1fa430961976
