// Firebase Seed Script
// This script initializes your Firebase Firestore database with sample products.
// Run this script once to populate your database.
//
// Instructions:
// 1. Make sure you have Firebase credentials set up in your environment (.env.local)
// 2. Install admin SDK: npm install firebase-admin
// 3. Create a service account key from Firebase Console
// 4. Run: node scripts/seed-firebase.js

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Note: You'll need to set up your service account JSON file
// Download from Firebase Console -> Project Settings -> Service Accounts
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

const sampleProducts = [
  {
    id: 'prod-001',
    name: 'Premium Wireless Headphones',
    description: 'High-quality sound with noise cancellation and 30-hour battery life',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 'prod-002',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable executive chair with lumbar support and adjustable height',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1580684528844-86f4e9ad7e2e?w=500&h=500&fit=crop',
    category: 'Furniture',
    inStock: true,
  },
  {
    id: 'prod-003',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep beverages hot or cold for up to 24 hours with double-wall insulation',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=500&h=500&fit=crop',
    category: 'Sports',
    inStock: true,
  },
  {
    id: 'prod-004',
    name: '4K Webcam',
    description: 'Ultra-clear 4K resolution perfect for streaming and video calls',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 'prod-005',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable 100% organic cotton t-shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'Apparel',
    inStock: true,
  },
  {
    id: 'prod-006',
    name: 'Mechanical Keyboard',
    description: 'Professional-grade mechanical keyboard with RGB lighting',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829191301-441bbe27c36a?w=500&h=500&fit=crop',
    category: 'Electronics',
    inStock: true,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Add products to Firestore
    const batch = db.batch();
    sampleProducts.forEach((product) => {
      const docRef = db.collection('products').doc(product.id);
      batch.set(docRef, {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`✅ Successfully added ${sampleProducts.length} products to Firestore`);

    // Verify by reading back
    const snapshot = await db.collection('products').get();
    console.log(`📊 Total products in database: ${snapshot.size}`);

    await admin.app().delete();
    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
