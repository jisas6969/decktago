'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using the Decktago platform operated by Deckta Pacific Equities, Inc., you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. User Accounts',
    content:
      'You must provide accurate and complete information when creating a Decktago account. You are responsible for maintaining the security of your account credentials. Decktago uses Firebase Authentication to secure accounts via email/password or Google Sign-In. You must not share your account access with others.',
  },
  {
    title: '3. Product Orders',
    content:
      'All orders placed through Decktago are subject to availability and confirmation. Decktago reserves the right to cancel or modify orders in cases of pricing errors, stock unavailability, or suspected fraudulent activity. Order confirmation does not guarantee final shipment until processing is complete.',
  },
  {
    title: '4. Payments',
    content:
      'Decktago currently accepts Cash, Cheque, and Bank Transfer as payment methods. All transactions must be completed in Philippine Peso (PHP). Payment must be settled before or upon delivery, depending on the method selected. Failure to complete payment may result in order cancellation.',
  },
  {
    title: '5. Delivery Policy',
    content:
      'Orders are delivered directly by Deckta Pacific Equities, Inc. using the company\'s own delivery process. Delivery times may vary depending on location and order volume. Decktago is not responsible for delays caused by circumstances outside its control, including but not limited to weather, natural disasters, or access restrictions.',
  },
  {
    title: '6. Returns & Refunds',
    content:
      'Refund and return requests are assessed on a case-by-case basis. Items must be reported with valid justification. Approved refunds will be processed through the original payment method. To initiate a return or refund, please use the live chat support widget available on the platform.',
  },
  {
    title: '7. Account Suspension',
    content:
      'Decktago reserves the right to suspend or terminate accounts that violate these Terms & Conditions, engage in fraudulent activity, misuse the platform, or provide false information during registration or ordering.',
  },
  {
    title: '8. Account Deletion',
    content:
      'Users may permanently delete their accounts through Account Settings → Privacy Settings. Account deletion is irreversible and will remove all associated user data, including order history and saved addresses, from the Decktago system. For security, deletion requires identity verification through password confirmation or Google reauthentication.',
  },
  {
    title: '9. User Responsibilities',
    content:
      'You agree to use Decktago only for lawful purposes. You must not attempt to gain unauthorized access to any part of the platform, interfere with the system\'s functionality, or use the platform to engage in deceptive or harmful activities.',
  },
  {
    title: '10. Intellectual Property',
    content:
      'All content on the Decktago platform, including the brand name, logo, product descriptions, and UI design, is the property of Deckta Pacific Equities, Inc. Unauthorized reproduction, distribution, or commercial use of any platform content is strictly prohibited.',
  },
  {
    title: '11. Limitation of Liability',
    content:
      'Deckta Pacific Equities, Inc. shall not be held liable for any indirect, incidental, or consequential damages arising from the use of the Decktago platform. The platform is provided "as is" and we make no warranties regarding uninterrupted or error-free access.',
  },
  {
    title: '12. Platform Changes',
    content:
      'Decktago reserves the right to modify, suspend, or discontinue any feature, product, or service at any time without prior notice. Prices, availability, and platform policies may be updated periodically.',
  },
  {
    title: '13. Governing Law',
    content:
      'These Terms & Conditions are governed by the laws of the Republic of the Philippines. Any disputes shall be subject to the exclusive jurisdiction of the appropriate courts in Metro Manila.',
  },
  {
    title: '14. Contact & Company Information',
    content:
      'For questions or concerns about these Terms & Conditions, please use the built-in live chat support on the Decktago platform.\n\nDeckta Pacific Equities, Inc.\n268 C. Raymundo Ave, Pasig, Metro Manila, Philippines\nTel: (02) 571-8698',
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2787b4] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 font-medium">Terms & Conditions</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please read these terms carefully before using the Decktago platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">

        {/* Intro card */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-[#2787b4] mb-1">Deckta Pacific Equities, Inc.</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            These Terms & Conditions govern your use of the Decktago ecommerce platform. By creating an account or placing an order, you acknowledge that you have read and agreed to these terms.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-xl border border-gray-200 px-6 py-5"
          >
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}

        {/* Footer note */}
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-center mt-6">
          <p className="text-xs text-gray-400">
            These Terms & Conditions were last updated in 2025.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2025 Decktago by Deckta Pacific Equities, Inc. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
