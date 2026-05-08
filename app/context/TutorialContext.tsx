'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ─── Fallback (if no products exist in Firestore) ─────────────
const FALLBACK_PRODUCT = {
  id: 'fallback-demo',
  name: 'Sample Product',
  price: 250,
  imageUrl: '/placeholder.png',
  category: 'Demo',
  type: 'Sample',
};

// ─── Demo Address (static) ────────────────────────────────────
export const DEMO_ADDRESS = {
  id: 'demo-addr',
  fullName: 'Juan Dela Cruz',
  phone: '09123456789',
  street: 'Sample Street',
  barangay: 'Sample Barangay',
  city: 'Sample City',
  province: 'Sample Province',
  postalCode: '1000',
  isDefault: true,
};

// ─── Types ────────────────────────────────────────────────────
type DemoProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  type?: string;
  [key: string]: any;
};

type DemoCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
};

type DemoOrder = {
  id: string;
  userId: string;
  status: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  shippingAddress: typeof DEMO_ADDRESS;
  createdAt: Date;
};

// ─── Step Configuration ───────────────────────────────────────
export type TutorialStepConfig = {
  elementIds: string[];
  tooltip: string;
  page: string;
  nextLabel?: string;
  isFinal?: boolean;
  beforeNext?: string;
};

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    elementIds: ['add-to-cart-btn', 'quantity-plus', 'quantity-minus'],
    tooltip: 'Welcome! Browse products, select quantity, and add items to your cart ',
    page: '/',
    nextLabel: 'Next →',
  },
  {
    elementIds: ['cart-item-demo', 'checkout-btn'],
    tooltip: 'This is your cart. Review items before checkout ',
    page: '/cart',
    nextLabel: 'Next →',
  },
  {
  page: '/checkout',
  elementIds: ['order-type'],
  tooltip: 'Choose whether you want Delivery or Pickup.',
  nextLabel: 'Next',
  },
  {
    elementIds: ['address-section'],
    tooltip: 'Review your order and delivery address before placing it ',
    page: '/checkout',
    nextLabel: 'Next →',
    beforeNext: 'open-address-modal',
  },
  {
    elementIds: ['address-fullname', 'address-phone', 'address-picker', 'address-submit'],
    tooltip: 'Fill in your delivery address details ',
    page: '/checkout',
    nextLabel: 'Next →',
    beforeNext: 'close-address-modal',
  },
  {
    elementIds: ['order-card'],
    tooltip: 'View and track all your orders here ',
    page: '/orders',
    nextLabel: 'Next →',
  },
  {
    elementIds: ['tracking-progress'],
    tooltip: 'Track your order status in real time! ',
    page: '/orders/demo-order',
    nextLabel: 'Finish ',
    isFinal: true,
  },
];

// ─── Context Type ─────────────────────────────────────────────
type TutorialContextType = {
  step: number;
  isTutorialActive: boolean;
  currentConfig: TutorialStepConfig | null;
  startTutorial: () => void;
  nextStep: () => void;
  endTutorial: () => void;
  shouldOpenAddressModal: boolean;
  setShouldOpenAddressModal: (v: boolean) => void;
  shouldCloseAddressModal: boolean;
  setShouldCloseAddressModal: (v: boolean) => void;
  /** Dynamic demo data fetched from Firestore */
  demoProduct: DemoProduct;
  demoCartItem: DemoCartItem;
  demoOrder: DemoOrder;
};

const TutorialContext = createContext<TutorialContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────
export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [shouldOpenAddressModal, setShouldOpenAddressModal] = useState(false);
  const [shouldCloseAddressModal, setShouldCloseAddressModal] = useState(false);
  const [demoProduct, setDemoProduct] = useState<DemoProduct>(FALLBACK_PRODUCT);

  // Hydrate step from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tutorialStep');
      if (saved) setStep(Number(saved));
    } catch {
      // SSR or storage unavailable
    }
  }, []);

  // 🔥 Fetch a real product from Firestore for demo data
  useEffect(() => {
    const fetchDemoProduct = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (!snap.empty) {
          const productDoc = snap.docs[0];
          setDemoProduct({
            id: productDoc.id,
            ...productDoc.data(),
          } as DemoProduct);
        }
        // If empty, FALLBACK_PRODUCT stays in state
      } catch (err) {
        console.error('Failed to fetch demo product:', err);
        // Fallback stays in state
      }
    };

    fetchDemoProduct();
  }, []);

  const startTutorial = useCallback(() => {
    setStep(1);
    localStorage.setItem('tutorialStep', '1');
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => {
      const next = prev + 1;
      localStorage.setItem('tutorialStep', String(next));
      return next;
    });
  }, []);

  const endTutorial = useCallback(() => {
    setStep(0);
    localStorage.removeItem('tutorialStep');
    setShouldOpenAddressModal(false);
    setShouldCloseAddressModal(false);
  }, []);

  const isTutorialActive = step > 0 && step <= TUTORIAL_STEPS.length;

  const currentConfig = useMemo(() => {
    if (!isTutorialActive) return null;
    return TUTORIAL_STEPS[step - 1];
  }, [step, isTutorialActive]);

  // 🔥 Derived demo cart item from fetched product
  const demoCartItem = useMemo<DemoCartItem>(() => ({
    id: demoProduct.id,
    name: demoProduct.name,
    price: demoProduct.price,
    quantity: 1,
    image: demoProduct.imageUrl || '/placeholder.png',
    unit: 'kg',
  }), [demoProduct]);

  // 🔥 Derived demo order from fetched product
  const demoOrder = useMemo<DemoOrder>(() => ({
    id: 'demo-order',
    userId: 'demo',
    status: 'out_for_delivery',
    items: [
      {
        id: demoProduct.id,
        name: demoProduct.name,
        price: demoProduct.price,
        quantity: 1,
      },
    ],
    shippingAddress: DEMO_ADDRESS,
    createdAt: new Date(),
  }), [demoProduct]);

  const value = useMemo(
    () => ({
      step,
      isTutorialActive,
      currentConfig,
      startTutorial,
      nextStep,
      endTutorial,
      shouldOpenAddressModal,
      setShouldOpenAddressModal,
      shouldCloseAddressModal,
      setShouldCloseAddressModal,
      demoProduct,
      demoCartItem,
      demoOrder,
    }),
    [step, isTutorialActive, currentConfig, startTutorial, nextStep, endTutorial, shouldOpenAddressModal, shouldCloseAddressModal, demoProduct, demoCartItem, demoOrder]
  );

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────
export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used inside TutorialProvider');
  }
  return context;
}