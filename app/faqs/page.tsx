'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

const faqs = [
  {
    category: 'Orders',
    items: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse the available product catalog, select the items and quantities required, add them to your cart, and proceed to checkout. Choose your payment method (Cash, Cheque, or Bank Transfer) and submit your order for processing and delivery coordination.',
      },
      {
        question: 'Can I cancel my order?',
        answer:
          'Orders may only be cancelled before they have been processed or scheduled for delivery. Go to the Orders page, open the specific order, and use the Cancel option if it is still available. For urgent cancellations, please use the live chat support.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'Decktago currently accepts Cash, Cheque, and Bank Transfer. We are working on expanding payment options in the future.',
      },
      {
        question: 'Is Cash on Delivery available?',
        answer:
          'Decktago currently accepts Cash, Cheque, and Bank Transfer for all business transactions. These methods are aligned with commercial and B2B payment standards.',
      },
    ],
  },
  {
    category: 'Delivery',
    items: [
      {
        question: 'How long does delivery take?',
        answer:
          'Delivery schedules vary depending on order volume, location, and logistics availability. Deckta Pacific Equities, Inc. manages all delivery coordination directly. You will be contacted once your order is confirmed and ready for dispatch.',
      },
      {
        question: 'How are orders delivered?',
        answer:
          'Orders are delivered directly by Deckta Pacific Equities, Inc. using the company\'s own delivery handling process to ensure product quality and reliable service.',
      },
    ],
  },
  {
    category: 'Refunds',
    items: [
      {
        question: 'How do refunds work?',
        answer:
          'Refund and return requests are assessed on a case-by-case basis in line with company policy. Please use the live chat support system for order assistance, dispute resolution, or to initiate a refund coordination request.',
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        question: 'How do I change my account password?',
        answer:
          'Go to Account Settings → Change Password. If you signed in with Google, you will need to create a password first before you can change it. For security, you will be asked to verify your current password.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Go to Account Settings → Privacy Settings → Request Account Deletion. For security, account deletion requires password confirmation (for email/password accounts) or Google reauthentication (for Google accounts). This action is irreversible.',
      },
    ],
  },
  {
    category: 'Support',
    items: [
      {
        question: 'How do I contact customer support?',
        answer:
          'Use the built-in live chat support widget at the bottom-right corner of the platform. Our team is available to assist with order coordination, delivery inquiries, account issues, and general business support.',
      },
    ],
  },
];

export default function FAQsPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2787b4] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 font-medium">FAQs</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find answers about ordering, payments, delivery, and account management.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-10">
          {faqs.map((group) => (
            <div key={group.category}>
              {/* Category Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2787b4]">
                  {group.category}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Accordion items */}
              <div className="space-y-3">
                {group.items.map((faq, idx) => {
                  const key = `${group.category}-${idx}`;
                  const isOpen = openKey === key;
                  return (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-shadow hover:shadow-sm"
                    >
                      <button
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2787b4] rounded-xl"
                      >
                        <span className="text-sm sm:text-base font-medium text-gray-800 pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[#2787b4] transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="px-5 pb-5 pt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div className="mt-14 rounded-xl border border-blue-100 bg-blue-50 px-6 py-6 text-center">
          <p className="text-sm font-semibold text-[#2787b4] mb-1">Need further assistance?</p>
          <p className="text-sm text-gray-500">
            Use the live chat widget at the bottom-right of the page to reach our team for order coordination, delivery inquiries, or account support.
          </p>
        </div>
      </div>
    </div>
  );
}
