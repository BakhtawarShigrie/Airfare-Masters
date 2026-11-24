"use client";

import React from "react";
import Link from "next/link";
import Globe from "./Globe";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#040916] flex items-center">
      {/* Subtle Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.14),transparent_55%),radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.12),transparent_50%)]"
      />

      {/* Interactive 3D Globe Layer */}
      <div className="absolute inset-0 z-0">
        <Globe />
      </div>

      {/* Readability Gradient Overlay (Pointer-events-none so Globe remains draggable) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#040916]/90 via-[#040916]/60 to-transparent"
      />

      {/* Main Hero Content */}
      <div className="relative z-10 pointer-events-none w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-28 pb-16">
        <div className="max-w-2xl">
          {/* Top Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-sky-400/25 backdrop-blur-md text-sky-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Global Aviation &amp; Travel Partner</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Explore the World with{" "}
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Airfare Masters
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            Book competitive domestic &amp; international flights, process
            global visit visas, and discover curated world tour packages with
            dedicated 24/7 travel support.
          </p>

          {/* 3 Equal-Size Attractive Action Buttons */}
          <div className="pointer-events-auto mt-9 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {/* Button 1: Book a Flight */}
            <Link
              href="/air-ticketing"
              className="group relative w-full h-[56px] px-5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white font-bold text-sm sm:text-[15px] tracking-wide flex items-center justify-center gap-2.5 whitespace-nowrap shadow-[0_10px_28px_rgba(14,165,233,0.38)] hover:shadow-[0_14px_34px_rgba(14,165,233,0.58)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <svg
                className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Book a Flight</span>
            </Link>

            {/* Button 2: Get Your Visa */}
            <Link
              href="/visa"
              className="group relative w-full h-[56px] px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-bold text-sm sm:text-[15px] tracking-wide flex items-center justify-center gap-2.5 whitespace-nowrap shadow-[0_10px_28px_rgba(245,158,11,0.32)] hover:shadow-[0_14px_34px_rgba(245,158,11,0.52)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <svg
                className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Get Your Visa</span>
            </Link>

            {/* Button 3: Explore Tours */}
            <Link
              href="/tours"
              className="group relative w-full h-[56px] px-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 hover:from-sky-950/90 hover:to-indigo-950/90 text-white font-bold text-sm sm:text-[15px] tracking-wide border border-sky-400/35 hover:border-sky-300/75 backdrop-blur-md flex items-center justify-center gap-2.5 whitespace-nowrap shadow-[0_10px_28px_rgba(2,6,23,0.5)] hover:shadow-[0_14px_34px_rgba(56,189,248,0.28)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-sky-300/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <svg
                className="w-4 h-4 text-sky-400 shrink-0 transition-transform duration-300 group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span>Explore Tours</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}