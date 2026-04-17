# ShopHub - Firebase Ecommerce App Setup Guide

Welcome to ShopHub! This is a modern ecommerce application built with Next.js, Firebase, and Tailwind CSS. Follow this guide to get your app up and running.

## Prerequisites

- Node.js 16.x or higher
- A Firebase project (create one at [firebase.google.com](https://firebase.google.com))
- npm or pnpm package manager

## Step 1: Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication:
   - Go to **Authentication** > **Sign-in method**
   - Enable **Email/Password** authentication
3. Create Firestore Database:
   - Go to **Firestore Database**
   - Create a new database in **Production mode**
   - Accept the default security rules for now

## Step 2: Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **Your apps**, click the **Web** option or create a new web app
3. Copy your Firebase configuration (it will look like this):
   ```javascript
   {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   }
   ```

## Step 3: Set Environment Variables

Create a `.env.local` file in the root directory and add your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

These variables are already set in the Vercel project settings.

## Step 4: Install Dependencies

```bash
pnpm install
```

## Step 5: Seed Sample Data (Optional)

To populate your database with sample products:

1. Download a service account key from Firebase:
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate New Private Key**
   - Save it as `serviceAccountKey.json` in the project root

2. Install the admin SDK:
   ```bash
   pnpm add -D firebase-admin
   ```

3. Run the seed script:
   ```bash
   node scripts/seed-firebase.js
   ```

## Step 6: Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## Features

### Authentication
- Email/password signup and login
- Protected routes with automatic redirects
- User data stored in Firestore

### Product Catalog
- Browse products with real-time Firestore data
- Add products to cart
- Responsive design for mobile and desktop

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time cart totals
- Local persistence during session

### Checkout
- Collect shipping address and payment info
- Create orders in Firestore with "Pending" status
- Clear cart after successful checkout

### Order Tracking
- View all orders with status updates
- Track order progress through statuses:
  - Pending
  - In Production
  - In Transit
  - Out for Delivery
  - Delivered
- Real-time status updates via Firestore listeners

### Sales Dashboard
- View total sales (from delivered orders)
- Monitor order count
- Track recent orders
- Real-time metrics updates

## Firestore Database Structure

### Collections

#### `products`
```
{
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  createdAt: timestamp
}
```

#### `users`
```
{
  email: string
  displayName: string
  createdAt: timestamp
}
```

#### `orders`
```
{
  userId: string
  items: [
    {
      id: string
      name: string
      price: number
      quantity: number
    }
  ]
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  totalAmount: number
  status: 'Pending' | 'In Production' | 'In Transit' | 'Out for Delivery' | 'Delivered'
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Updating Order Status (Admin)

Orders can be updated directly in the Firestore console. To change an order's status:

1. Go to **Firestore Database**
2. Open the **orders** collection
3. Click on an order document
4. Edit the **status** field to one of:
   - `Pending`
   - `In Production`
   - `In Transit`
   - `Out for Delivery`
   - `Delivered`

The app will show real-time updates as statuses change.

## Troubleshooting

### "Firebase is not initialized"
- Make sure all environment variables are set correctly in `.env.local`
- Verify your Firebase project is active and not deleted

### "Auth/invalid-api-key"
- Check that your API key is correct in `.env.local`
- Ensure the key is enabled in Firebase Console

### Products not loading
- Verify Firestore database exists and is in Production mode
- Check that products collection exists (run seed script)
- Check browser console for errors

### Orders not showing
- Ensure user is logged in
- Check Firestore security rules allow reading user's orders
- Verify orders were created with correct userId

## Security Notes

For production deployment:

1. **Update Firestore Rules**: Replace default rules with proper RLS:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /products/{doc=**} {
         allow read;
       }
       match /orders/{doc=**} {
         allow read, write: if request.auth.uid == resource.data.userId;
         allow create: if request.auth.uid != null;
       }
       match /users/{doc=**} {
         allow read, write: if request.auth.uid == doc;
       }
     }
   }
   ```

2. **Never commit `.env.local`**: Add it to `.gitignore`

3. **Use HTTPS**: Always serve over HTTPS in production

4. **Validate on server**: Implement backend validation for sensitive operations

## Deployment

To deploy to Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in project settings
5. Deploy!

## Support

For issues or questions:
- Check Firebase documentation: [firebase.google.com/docs](https://firebase.google.com/docs)
- Visit Next.js docs: [nextjs.org](https://nextjs.org)
- Open an issue on GitHub if needed

Happy selling! 🛍️
