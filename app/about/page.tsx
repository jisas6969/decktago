'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ShieldCheck, Truck, MessageSquare, ClipboardList, Lock,
  Building2, CheckCircle2, Thermometer, MapPin, Package,
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Food Safety Standards',
    description:
      'Operations follow Good Manufacturing Practice (GMP) guidelines to maintain strict food safety and handling standards across all products.',
  },
  {
    icon: Truck,
    title: 'Refrigerated Direct Delivery',
    description:
      'All orders are transported using dedicated refrigerated vehicles managed directly by Deckta Pacific Equities, Inc. to preserve cold-chain integrity.',
  },
  {
    icon: MessageSquare,
    title: 'Dedicated Business Support',
    description:
      'Our team provides direct order coordination and delivery assistance through the platform\'s built-in live chat support system.',
  },
  {
    icon: ClipboardList,
    title: 'Streamlined Supply Ordering',
    description:
      'Business clients can submit product orders efficiently through the platform with real-time status tracking and full order history.',
  },
  {
    icon: Lock,
    title: 'Secure Account & Transactions',
    description:
      'All accounts are secured via Firebase Authentication. Transactions support Cash, Cheque, and Bank Transfer for commercial convenience.',
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
                Reliable frozen meat supply and food distribution services for restaurants, commercial establishments, and business partners across the Philippines. Supporting both direct company delivery and warehouse pickup for flexible order fulfillment.
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

        {/* Platform Overview card */}
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
              A digital supply ordering platform for businesses and commercial clients — enabling direct access to frozen meat and food products distributed by Deckta Pacific Equities, Inc.
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              Decktago was built to digitize the supply and distribution operations of Deckta Pacific Equities, Inc. Business clients, restaurants, and commercial establishments can submit orders directly through the platform and receive refrigerated, company-managed deliveries or arrange warehouse pickup — with full order tracking and account management built in.
            </p>
          </div>
        </div>

        {/* About the company */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">About Deckta Pacific Equities, Inc.</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Deckta Pacific Equities, Inc. is a Philippine-based importer and distributor of frozen meat and food products serving restaurants, food businesses, and commercial partners across the country. With a strong focus on food safety, cold-chain logistics, and reliable distribution, the company operates dedicated storage and delivery facilities to maintain product quality from warehouse to destination.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Located in Pasig City, Metro Manila, Deckta Pacific Equities, Inc. supports both direct company-managed delivery and warehouse pickup arrangements for customers and business partners — combining quality-controlled handling, temperature-managed logistics, and responsive business support.
          </p>

          {/* Operational Highlights */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'NMIS-Accredited Cold Storage Facility', Icon: Building2 },
              { label: 'Good Manufacturing Practice (GMP) Compliance', Icon: CheckCircle2 },
              { label: 'Dedicated Refrigerated Delivery Fleet', Icon: Truck },
              { label: 'Cold-Chain Integrity from Storage to Delivery', Icon: Thermometer },
              { label: 'Metro Manila & Nearby Provinces Coverage', Icon: MapPin },
              { label: 'Commercial Food Distribution Services', Icon: Package },
            ].map(({ label, Icon }) => (
              <div key={label} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div className="w-7 h-7 rounded-md bg-[#e9f4fa] flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[#2787b4]" />
                </div>
                <span className="text-xs text-gray-600 leading-relaxed pt-1">{label}</span>
              </div>
            ))}
          </div>
  
        </div>

        {/* Mission */}
        <div className="bg-[#e9f4fa] rounded-xl border border-blue-100 px-6 py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2787b4] mb-3">Our Mission</p>
          <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed max-w-xl mx-auto">
            "To be the most trusted frozen meat and food distribution partner for businesses across the Philippines — delivering product quality, cold-chain reliability, and professional service from every order."
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
