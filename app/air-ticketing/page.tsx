"use client";

import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import ScrollFrameCanvas from "./components/ScrollFrameCanvas";
import FlightSearchWidget from "./components/FlightSearchWidget";

const POPULAR_ROUTES = [
  {
    route: "Lahore → Dubai",
    airlines: "Emirates • PIA • flydubai • Airblue",
    tag: "Daily Direct Flights",
  },
  {
    route: "Lahore → Jeddah / Riyadh",
    airlines: "Saudia • PIA • flynas • AirSial",
    tag: "Umrah & Business Fares",
  },
  {
    route: "Islamabad → London",
    airlines: "British Airways • Virgin Atlantic • Qatar",
    tag: "Flexible Baggage Deals",
  },
  {
    route: "Lahore → Istanbul",
    airlines: "Turkish Airlines • Pegasus",
    tag: "Europe Transit Hub",
  },
  {
    route: "Karachi → Doha",
    airlines: "Qatar Airways • PIA",
    tag: "Global Connections",
  },
  {
    route: "Lahore → Toronto",
    airlines: "PIA • Etihad • Emirates • Turkish",
    tag: "Student & Family Discounts",
  },
];

export default function AirTicketingPage() {
  const bookingSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#040916] text-white">
      <Navbar />

      {/* 300-Frame Scroll-Scrubbed Aviation Experience */}
      <ScrollFrameCanvas onBookNowClick={scrollToBooking} />

      {/* Flight Search & Booking Section */}
      <section
        ref={bookingSectionRef}
        id="book-flight"
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-16 pb-20"
      >
        <FlightSearchWidget />

        {/* Popular International Sectors */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-amber-300">
                TOP INTERNATIONAL CORRIDORS
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Popular Flight Sectors
              </h3>
            </div>
            <a
              href="tel:+923084813513"
              className="text-xs sm:text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              24/7 Ticketing Helpline: +92 308 4813513 &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_ROUTES.map((item) => (
              <div
                key={item.route}
                onClick={scrollToBooking}
                className="group rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-sky-400/40 p-5 transition-all cursor-pointer"
              >
                <div className="inline-block px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 text-[10px] font-bold tracking-wider uppercase">
                  {item.tag}
                </div>
                <div className="text-lg font-bold text-white mt-3 group-hover:text-sky-300 transition-colors">
                  {item.route}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {item.airlines}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}