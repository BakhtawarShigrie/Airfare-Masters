"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Air Ticketing", href: "/air-ticketing" },
  { label: "Visa Services", href: "/visa" },
  { label: "World Tours", href: "/tours" },
  { label: "Book a Flight", href: "/air-ticketing#book-flight" },
];

const OUR_SERVICES = [
  "Domestic & International Air Ticketing",
  "UK, USA, Canada & Schengen Visas",
  "UAE, Turkey & Asian E-Visas",
  "Customized World Holiday Tours",
  "Corporate & Group Flight Bookings",
];

export default function Footer() {
  return (
    <footer className="relative z-20 bg-[#050b16] border-t border-white/10 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-16 pb-10">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Brand Logo & Description */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center focus:outline-none"
              aria-label="Airfare Masters Home"
            >
              <Image
                src="/logo-white.png"
                alt="Airfare Masters"
                width={185}
                height={48}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your trusted travel partner in Lahore for worldwide domestic &amp;
              international air ticketing, visit &amp; e-visas, hotel
              reservations, and customized world holiday tours.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-5">
              QUICK LINKS
            </h3>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-5">
              OUR SERVICES
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {OUR_SERVICES.map((service) => (
                <li key={service} className="leading-snug">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch / Travel Desk */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-5">
              GET IN TOUCH
            </h3>
            <ul className="space-y-4 text-sm">
              {/* Location */}
              <li className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 text-sky-400 shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-slate-300 leading-relaxed">
                  Lahore, Pakistan
                  <span className="block text-xs text-slate-400">
                    Worldwide Air Ticketing Desk
                  </span>
                </span>
              </li>

              {/* Phone & WhatsApp */}
              <li className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 text-sky-400 shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div className="space-y-1">
                  <a
                    href="tel:+923084813513"
                    className="block text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    +92 308 4813513
                  </a>
                  <a
                    href="https://wa.me/923084813513"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    WhatsApp: +92 308 4813513
                  </a>
                </div>
              </li>

              {/* Official Email */}
              <li className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 text-sky-400 shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info.aifaremasters@gmail.com"
                  className="text-slate-300 hover:text-sky-400 transition-colors break-all"
                >
                  info.aifaremasters@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Developer Credit Bar */}
        <div className="pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; 2026 Airfare Masters. All rights reserved.</p>
          <p>
            Developed by{" "}
            <span className="text-slate-300 font-semibold">
              Shigrony (Pvt) Ltd.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}