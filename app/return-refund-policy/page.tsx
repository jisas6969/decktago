'use client';

import Link from 'next/link';
import {
  ChevronRight,
  ClipboardCheck,
  AlertTriangle,
  XCircle,
  Thermometer,
  Clock,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

const sections = [
  {
    icon: ClipboardCheck,
    title: '1. Product Inspection Upon Receiving',
    content: [
      {
        subtitle: 'Inspect Immediately',
        text: 'Customers are encouraged to inspect all products immediately upon receiving their order — whether through direct company delivery or warehouse pickup. Any visible concerns regarding packaging, product condition, or order completeness should be noted at the time of turnover.',
      },
      {
        subtitle: 'Delivery Inspection',
        text: 'For orders delivered by Deckta Pacific Equities, Inc., customers should verify the products upon handover. Any concerns should be raised with the delivery personnel before the transaction is completed.',
      },
      {
        subtitle: 'Warehouse Pickup Inspection',
        text: 'For warehouse pickup orders, customers should inspect products at the pickup point before leaving the premises. Post-pickup concerns must be reported as soon as possible.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: '2. Eligible Concerns',
    content: [
      {
        subtitle: 'Accepted Return & Refund Situations',
        text: 'The following situations may qualify for a return, replacement, or refund review, subject to verification by Deckta Pacific Equities, Inc.:',
      },
      {
        subtitle: 'Damaged Packaging',
        text: 'Products delivered or collected with visibly damaged, torn, or compromised packaging that may affect product integrity.',
      },
      {
        subtitle: 'Incorrect Items',
        text: 'Orders containing wrong product types, cuts, or quantities that do not match the confirmed order.',
      },
      {
        subtitle: 'Incomplete Orders',
        text: 'Orders where confirmed items are missing upon delivery or pickup.',
      },
      {
        subtitle: 'Compromised Frozen Condition',
        text: 'Products found to be partially or fully thawed upon turnover, or showing signs of temperature compromise that occurred prior to customer acceptance.',
      },
      {
        subtitle: 'Verified Quality Concerns',
        text: 'Quality concerns that are identified and reported at the point of delivery or pickup, and can be verified by the company.',
      },
    ],
  },
  {
    icon: XCircle,
    title: '3. Non-Eligible Concerns',
    content: [
      {
        subtitle: 'Situations Not Covered',
        text: 'The following situations are not covered under this Return & Refund Policy:',
      },
      {
        subtitle: 'Improper Customer Storage',
        text: 'Quality issues resulting from improper storage, handling, or temperature management by the customer after product acceptance.',
      },
      {
        subtitle: 'Delayed Reporting',
        text: 'Concerns reported significantly after the time of delivery or pickup without valid justification.',
      },
      {
        subtitle: 'Products Already Consumed',
        text: 'Return or refund requests for products that have already been used, processed, or consumed.',
      },
      {
        subtitle: 'Change of Mind',
        text: 'Returns based solely on customer preference changes or ordering errors that do not involve product defects or delivery issues.',
      },
      {
        subtitle: 'Improper Temperature Maintenance',
        text: 'Products stored outside recommended frozen temperatures after acceptance by the customer.',
      },
    ],
  },
  {
    icon: Thermometer,
    title: '4. Cold-Chain Responsibility',
    content: [
      {
        subtitle: 'Transfer of Responsibility',
        text: 'Deckta Pacific Equities, Inc. maintains strict cold-chain protocols from storage to delivery or pickup point. Once products are accepted by the customer during delivery or at the warehouse, Deckta Pacific Equities, Inc. is no longer responsible for quality issues caused by improper handling, storage, or temperature management beyond the company\'s control.',
      },
      {
        subtitle: 'Our Commitment',
        text: 'Prior to turnover, all frozen products are handled in accordance with food safety and cold-chain standards to ensure product integrity is maintained from our facility to the point of handover.',
      },
    ],
  },
  {
    icon: Clock,
    title: '5. Reporting Timeframe',
    content: [
      {
        subtitle: 'Report As Soon As Possible',
        text: 'Order concerns should be reported as soon as possible after receiving or picking up the products. Prompt reporting allows our team to assess and verify the issue efficiently and coordinate an appropriate resolution.',
      },
      {
        subtitle: 'How to Report',
        text: 'Use the built-in live chat support widget available at the bottom-right of the Decktago platform to report your concern. Include your order reference and a description of the issue.',
      },
    ],
  },
  {
    icon: RefreshCw,
    title: '6. Refund & Resolution Process',
    content: [
      {
        subtitle: 'Verification First',
        text: 'All reported concerns are subject to review and verification by Deckta Pacific Equities, Inc. The company reserves the right to assess each case individually before determining an appropriate resolution.',
      },
      {
        subtitle: 'Possible Resolutions',
        text: 'Depending on the verified findings, eligible concerns may result in one or more of the following outcomes:',
      },
      {
        subtitle: 'Product Replacement',
        text: 'A replacement order may be arranged for verified cases involving incorrect or damaged items.',
      },
      {
        subtitle: 'Account Credit or Refund Review',
        text: 'Approved refunds or account credits may be issued following investigation and confirmation of the concern. Refund processing will follow the original payment method where applicable.',
      },
      {
        subtitle: 'Coordinated Resolution',
        text: 'For complex cases, our team will coordinate directly with the customer to reach a fair and timely resolution.',
      },
    ],
  },
  {
    icon: MessageSquare,
    title: '7. Contact & Support',
    content: [
      {
        subtitle: 'Live Chat Support',
        text: 'For all product concerns, return inquiries, or order coordination, please use the built-in live chat support widget at the bottom-right corner of the Decktago platform. Our team is available to assist with order-related issues and guide you through the resolution process.',
      },
      {
        subtitle: 'Order Coordination',
        text: 'Our support team handles all order coordination, including return verification and refund processing, through the platform\'s integrated support system.',
      },
    ],
  },
];

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#2787b4] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 font-medium">Return &amp; Refund Policy</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            Return &amp; Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Learn about our policies regarding product concerns, damaged items, and order-related issues.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Intro card */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-5">
          <p className="text-sm font-semibold text-[#2787b4] mb-1">Deckta Pacific Equities, Inc.</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            This Return &amp; Refund Policy applies to all orders fulfilled through the Decktago platform, including direct company deliveries and warehouse pickup arrangements. Given the nature of frozen and perishable food products, prompt inspection and timely reporting are essential.
          </p>
        </div>

        {/* Policy Sections */}
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-[#e9f4fa] flex items-center justify-center shrink-0">
                <Icon size={15} className="text-[#2787b4]" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-gray-800">{title}</h2>
            </div>

            {/* Subsections */}
            <div className="divide-y divide-gray-100">
              {content.map((item) => (
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
            This policy is subject to change. Continued use of the Decktago platform constitutes acceptance of the current policy.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2025 Decktago by Deckta Pacific Equities, Inc. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
