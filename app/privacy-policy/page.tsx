'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you register for a Decktago account, we collect your full name, email address, phone number, and company name. This information is used to manage your account and personalize your experience.',
      },
      {
        subtitle: 'Order & Transaction Data',
        text: 'We collect information related to your purchases, including the products ordered, quantities, pricing, order status, and order history. This data is stored to manage and fulfill your orders.',
      },
      {
        subtitle: 'Payment Information',
        text: 'Decktago supports Cash, Cheque, and Bank Transfer payments. We do not store credit card or full bank account details on our servers. Payment-related references used during transactions are handled securely.',
      },
      {
        subtitle: 'Delivery Information',
        text: 'To process your delivery, we collect your shipping address, including region, province, city, barangay, postal code, and street address. This information is used exclusively for order fulfillment.',
      },
    ],
  },
  {
    title: 'How We Use Your Data',
    content: [
      {
        subtitle: 'Account Management',
        text: 'Your information is used to create and maintain your Decktago account, verify your identity using Firebase Authentication, and allow secure login through email/password or Google Sign-In.',
      },
      {
        subtitle: 'Order Processing',
        text: 'We use your data to process, confirm, and deliver your orders. Order history and status updates are stored in your account for reference.',
      },
      {
        subtitle: 'Customer Support',
        text: 'Information you provide through our built-in live chat support system may be used to resolve inquiries, process refund requests, and improve our services.',
      },
      {
        subtitle: 'Platform Improvement',
        text: 'We may use aggregated, anonymized data to analyze platform performance, improve user experience, and identify technical issues.',
      },
    ],
  },
  {
    title: 'Account Security',
    content: [
      {
        subtitle: 'Authentication',
        text: 'Decktago uses Firebase Authentication to secure your account. Passwords are encrypted and never stored in plain text. For account deletion, identity verification is required through password confirmation or Google reauthentication.',
      },
      {
        subtitle: 'Your Responsibility',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. Please use a strong, unique password and do not share your login details with others.',
      },
    ],
  },
  {
    title: 'Cookies & Analytics',
    content: [
      {
        subtitle: 'Session & Functionality Cookies',
        text: 'We use cookies and local storage to maintain your session, remember cart items, and preserve your preferences during your visit. These are essential for the platform to function properly.',
      },
      {
        subtitle: 'Analytics',
        text: 'We may collect usage data to understand how users interact with the platform. This data is used solely to improve the Decktago experience and is not sold to third parties.',
      },
    ],
  },
  {
    title: 'Data Protection',
    content: [
      {
        subtitle: 'Storage & Security',
        text: 'Your data is stored securely using Google Firebase and Firestore services. We apply industry-standard practices to protect your data from unauthorized access, alteration, or disclosure.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your account and order data for as long as your account is active or as needed to provide services. Upon account deletion, your Firestore user document is permanently removed.',
      },
    ],
  },
  {
    title: 'Third-Party Services',
    content: [
      {
        subtitle: 'Firebase & Google',
        text: 'Decktago uses Firebase (by Google) for authentication, database, and storage services. Your data processed through Firebase is subject to Google\'s privacy practices.',
      },
      {
        subtitle: 'Cloudinary',
        text: 'Profile images are uploaded and stored via Cloudinary. Uploaded images are subject to Cloudinary\'s data handling policies.',
      },
    ],
  },
  {
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You may view and update your account information at any time through the Account Settings page, including your name, phone number, company, email address, and delivery addresses.',
      },
      {
        subtitle: 'Account Deletion',
        text: 'You have the right to permanently delete your account. This can be done through Account Settings → Privacy Settings. Deletion is irreversible and removes all associated user data from our systems.',
      },
    ],
  },
  {
    title: 'Policy Updates',
    content: [
      {
        subtitle: 'Changes to This Policy',
        text: 'Decktago by Deckta Pacific Equities, Inc. reserves the right to update this Privacy Policy at any time. Continued use of the platform after changes constitutes acceptance of the updated policy.',
      },
      {
        subtitle: 'Last Updated',
        text: 'This Privacy Policy was last updated in 2025.',
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2787b4] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 font-medium">Privacy Policy</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Learn how Decktago collects, uses, and protects your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Intro card */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-[#2787b4] mb-1">Deckta Pacific Equities, Inc.</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            This Privacy Policy explains how we handle the personal data of users of the Decktago ecommerce platform. By using our services, you agree to the practices described below.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm sm:text-base font-bold text-gray-800">{section.title}</h2>
            </div>
            {/* Subsections */}
            <div className="divide-y divide-gray-100">
              {section.content.map((item) => (
                <div key={item.subtitle} className="px-6 py-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#2787b4] mb-1.5">
                    {item.subtitle}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-center">
          <p className="text-xs text-gray-400">
            © 2025 Decktago by Deckta Pacific Equities, Inc. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            268 C. Raymundo Ave, Pasig, Metro Manila, Philippines
          </p>
        </div>

      </div>
    </div>
  );
}
