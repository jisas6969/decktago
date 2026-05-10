'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, ExternalLink } from 'lucide-react';

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-block border border-gray-300 rounded px-2.5 py-1 text-xs font-medium text-gray-600 bg-white hover:border-[#2787b4] hover:text-[#2787b4] transition-colors cursor-default select-none">
      {label}
    </span>
  );
}

const quickLinks = [
  { label: 'About Decktago', href: '/about' },
  { label: 'Return & Refund Policy', href: '#' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'FAQs', href: '/faqs' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand + Address + Map */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">

            {/* Logo + Brand */}
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logo.png"
                alt="Decktago Logo"
                width={36}
                height={36}
                className="rounded-md object-contain shrink-0"
              />
              <div className="leading-tight">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  <span className="text-black">Deckta</span>
                  <span style={{ color: '#2787b4' }}>Go</span>
                </h2>
                <p className="text-xs text-gray-400 leading-none mt-0.5">
                  by Deckta Pacific Equities, Inc.
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Meat supply and food distribution platform by Deckta Pacific Equities, Inc. Serving businesses across the Philippines with reliable, company-managed delivery.
            </p>

            {/* Address */}
            <div className="flex items-start gap-2 mb-2">
              <MapPin size={14} className="text-[#2787b4] mt-0.5 shrink-0" />
              <address className="not-italic text-xs text-gray-500 leading-relaxed">
                268 C. Raymundo Ave,<br />
                Pasig, Metro Manila,<br />
                Philippines
              </address>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 mb-5">
              <Phone size={13} className="text-[#2787b4] shrink-0" />
              <a
                href="tel:+63225718698"
                className="text-xs text-gray-500 hover:text-[#2787b4] transition-colors"
              >
                (02) 571-8698
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-lg overflow-hidden border border-gray-200 mb-2">
              <iframe
                title="Deckta Pacific Equities Location"
                src="https://maps.google.com/maps?q=268%20C.%20Raymundo%20Ave%20Pasig%20Metro%20Manila%20Philippines&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="160"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* View on Google Maps link */}
            <a
              href="https://www.google.com/maps/place/268+C.+Raymundo+Ave,+Pasig,+Metro+Manila,+Philippines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#2787b4] hover:underline transition-colors"
            >
              <MapPin size={12} />
              View on Google Maps
              <ExternalLink size={11} />
            </a>

          </div>

          {/* Column 2 — Quick Links */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-[#2787b4] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Live Chat Support Note */}
            <div className="mt-7 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-xs font-semibold text-[#2787b4] mb-1">Live Customer Support</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our support team is available through the built-in live chat system. Use the chat widget on the bottom right for assistance.
              </p>
            </div>
          </div>

          {/* Column 3 — Payment & Shipping */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-4">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2 mb-7">
              {['Cheque', 'Cash', 'Bank Transfer'].map((p) => (
                <Chip key={p} label={p} />
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-4">
              Company Delivery
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Orders are delivered directly by Deckta Pacific Equities, Inc. to ensure reliable handling and product quality.
            </p>
            <div className="group flex items-center gap-3 border border-gray-200 rounded-lg p-3 bg-white hover:border-[#2787b4] hover:shadow-sm transition-all cursor-default">
              <div className="w-10 h-10 rounded-full bg-[#e9f4fa] group-hover:bg-[#2787b4] transition-colors flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#2787b4] group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h6m2-1h2l3-4V9h-5v7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 group-hover:text-[#2787b4] transition-colors leading-tight">Direct Company Delivery</p>
                <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Handled by Deckta Pacific Equities, Inc.</p>
                <span className="inline-block mt-1.5 text-[10px] font-semibold bg-blue-50 text-[#2787b4] border border-blue-100 rounded-full px-2 py-0.5">
                  Trusted Delivery Service
                </span>
              </div>
            </div>
          </div>

          {/* Column 4 — App Download */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-4">
              Download App
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Shop on the go. Scan the QR code or download from your app store.
            </p>
            <div className="flex flex-row sm:flex-col gap-3 items-start">
              {/* QR Placeholder */}
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[10px] text-gray-400 text-center leading-tight px-1">
                  QR Code<br />Coming Soon
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-3 py-2 transition-colors w-fit"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <p className="text-[9px] leading-none text-gray-300">Download on the</p>
                    <p className="text-xs font-semibold leading-tight">App Store</p>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-3 py-2 transition-colors w-fit"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.64.24.99.21l12.24-12.24-3-3-10.23 15.03zM20.77 9.29L17.7 7.49 14.41 10.8l3.29 3.29 3.08-1.81c.88-.52.88-1.97-.01-2.99zM2.13.44C1.87.73 1.73 1.15 1.73 1.7v20.6c0 .55.14.97.4 1.26l.07.06 11.54-11.54v-.27L2.2.37l-.07.07zM12.87 13.35L1.73 24.49c.3.17.64.24.98.21.34-.03.67-.14.96-.34l.06-.04 12.24-7.2-3.1-3.77z" />
                  </svg>
                  <div>
                    <p className="text-[9px] leading-none text-gray-300">Get it on</p>
                    <p className="text-xs font-semibold leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © 2025 Decktago by Deckta Pacific Equities, Inc. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-400">🇵🇭 Philippines</p>
        </div>
      </div>
    </footer>
  );
}
