'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShieldCheck, Truck, MessageSquare, ShoppingCart, Lock } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Business Accounts',
    description:
      'Firebase Authentication protects your account with encrypted credentials and optional Google Sign-In for secure platform access.',
  },
  {
    icon: Truck,
    title: 'Direct Company Delivery',
    description:
      'All orders are delivered directly by Deckta Pacific Equities, Inc., ensuring reliable product handling from warehouse to destination.',
  },
  {
    icon: MessageSquare,
    title: 'Dedicated Order Support',
    description:
      'Our built-in live chat connects you with our team for order coordination, delivery updates, and customer assistance.',
  },
  {
    icon: ShoppingCart,
    title: 'Streamlined Order Processing',
    description:
      'Submit product orders quickly through the platform with real-time status tracking and order history management.',
  },
  {
    icon: Lock,
    title: 'Secure Transaction Handling',
    description:
      'Transactions are processed with privacy and integrity, supporting Cash, Cheque, and Bank Transfer payment methods.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2787b4] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 font-medium">About Decktago</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            About Decktago
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Learn more about Decktago and Deckta Pacific Equities, Inc.
          </p>
        </div>
      </div>

      {/* Hero — Split Layout */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* LEFT — Text Content */}
            <div className="flex-1 min-w-0 text-center lg:text-left">

              {/* Badge */}
              <span className="inline-block mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#2787b4] bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                Business Supply Platform
              </span>

              {/* Brand */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="Decktago Logo"
                  width={48}
                  height={48}
                  className="rounded-lg object-contain shrink-0"
                />
                <div className="leading-tight">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                    Deckta<span style={{ color: '#2787b4' }}>Go</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    by Deckta Pacific Equities, Inc.
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Reliable meat supply and food distribution services for restaurants, commercial establishments, and business partners across the Philippines.
              </p>

              {/* Info chips */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-6">
                {['Meat Supply', 'Food Distribution', 'Direct Delivery', 'B2B Services'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Image */}
            <div className="w-full lg:w-[480px] shrink-0">
              <div className="relative w-full h-[220px] sm:h-[280px] lg:h-[320px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src="/about-banner.jpg"
                  alt="Deckta Pacific Equities — Meat Supply and Food Distribution Operations"
                  fill
                  priority
                  className="object-cover object-center"
                />
                {/* Subtle bottom gradient for polish */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Hero intro card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#2787b4] px-6 py-8 text-white">
            <div className="mb-1">
              <span className="text-3xl font-extrabold tracking-tight">
                <span className="text-white">Deckta</span>
                <span className="text-blue-200">Go</span>
              </span>
            </div>
            <p className="text-blue-100 text-sm mt-1">by Deckta Pacific Equities, Inc.</p>
            <p className="text-white/90 text-sm mt-4 leading-relaxed max-w-xl">
              A digital supply and distribution platform built for businesses and commercial clients — managed end-to-end by Deckta Pacific Equities, Inc.
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              Decktago was built to bring the meat supply and food distribution operations of Deckta Pacific Equities, Inc. into a modern, accessible platform. Designed for business clients, restaurants, and commercial buyers, Decktago streamlines the ordering process with direct company-managed delivery and dedicated account support.
            </p>
          </div>
        </div>

        {/* About the company */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">About Deckta Pacific Equities, Inc.</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Deckta Pacific Equities, Inc. is a Philippine-based company engaged in meat supply, food product importation, and commercial distribution. Located in Pasig City, Metro Manila, the company operates with a focus on quality handling, reliable logistics, and business-oriented customer service.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Through the Decktago platform, Deckta Pacific Equities, Inc. digitizes its supply operations — allowing business clients to browse available products, place orders, and receive direct company-managed deliveries with full account transparency.
          </p>

          {/* Company Info block */}
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2787b4] mb-3">Company Information</p>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-gray-800">Deckta Pacific Equities, Inc.</p>
              <p className="text-sm text-gray-500">268 C. Raymundo Ave,</p>
              <p className="text-sm text-gray-500">Pasig, Metro Manila,</p>
              <p className="text-sm text-gray-500">Philippines</p>
              <p className="text-sm text-gray-500 pt-1">
                Tel:{' '}
                <a href="tel:+63225718698" className="hover:text-[#2787b4] transition-colors">
                  (02) 571-8698
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-[#e9f4fa] rounded-xl border border-blue-100 px-6 py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2787b4] mb-3">Our Mission</p>
          <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed max-w-xl mx-auto">
            "To be the trusted supply and distribution partner for businesses across the Philippines — delivering quality products with reliability, professionalism, and efficiency."
          </p>
        </div>

        {/* Why choose Decktago */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-5">Why Choose Decktago</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-200 px-5 py-5 flex items-start gap-4 hover:border-[#2787b4] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#e9f4fa] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#2787b4]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform features */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Platform Features</h2>
          <ul className="space-y-2.5">
            {[
              'Secure Firebase Authentication with Google Sign-In support',
              'Account privacy controls and permanent account deletion',
              'Integrated live chat for order coordination and business support',
              'Real-time order tracking and status updates',
              'Product catalog with category and type filtering for efficient sourcing',
              'Direct company-managed delivery by Deckta Pacific Equities, Inc.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2787b4] shrink-0" />
                <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

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
