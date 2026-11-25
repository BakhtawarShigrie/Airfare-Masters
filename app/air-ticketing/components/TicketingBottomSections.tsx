"use client";

import React, { useEffect, useRef, useState } from "react";

interface TicketingBottomSectionsProps {
  onBookFlightClick: () => void;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StatConfig {
  baseTarget: number;
  dailyIncrement: number;
  label: string;
  icon: React.ReactNode;
}

interface AirlinePartner {
  name: string;
  logoUrl: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// Reference anchor date (Nov 25, 2026) for automatic daily growth
const ANCHOR_TIMESTAMP_UTC = Date.UTC(2026, 10, 25);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const SMART_TRAVEL_FEATURES: FeatureCard[] = [
  {
    title: "Best Price Guarantee",
    description:
      "Find the lowest fares on domestic and international flights, every time.",
    icon: (
      <svg
        className="w-8 h-8 text-sky-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
      </svg>
    ),
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our dedicated Airfare Masters team is always here to help you with any booking or query.",
    icon: (
      <svg
        className="w-8 h-8 text-sky-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 13v-1a8 8 0 0116 0v1m-16 0a2 2 0 002 2h1a1 1 0 001-1v-3a1 1 0 00-1-1H6a2 2 0 00-2 2zm16 0a2 2 0 01-2 2h-1a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 012 2zm-2 2v2a3 3 0 01-3 3h-3"
        />
      </svg>
    ),
  },
  {
    title: "Secure & Easy Booking",
    description:
      "Book your flights with confidence using our secure and straightforward platform.",
    icon: (
      <svg
        className="w-8 h-8 text-sky-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    ),
  },
];

const JOURNEY_STATS: StatConfig[] = [
  {
    baseTarget: 15786,
    dailyIncrement: 17, // 15+ flights booked every day
    label: "FLIGHTS BOOKED",
    icon: (
      <svg
        className="w-9 h-9 text-slate-100 mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49L21 11.49c.81-.23 1.28-1.05 1.07-1.85z" />
      </svg>
    ),
  },
  {
    baseTarget: 253,
    dailyIncrement: 0,
    label: "DESTINATIONS COVERED",
    icon: (
      <svg
        className="w-9 h-9 text-slate-100 mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    baseTarget: 21759,
    dailyIncrement: 19, // 15+ happy travelers every day
    label: "HAPPY TRAVELERS",
    icon: (
      <svg
        className="w-9 h-9 text-slate-100 mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
    ),
  },
  {
    baseTarget: 99450,
    dailyIncrement: 104, // 97+ cups of coffee every day
    label: "CUPS OF COFFEE",
    icon: (
      <svg
        className="w-9 h-9 text-slate-100 mx-auto"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4v-2z" />
      </svg>
    ),
  },
];

const AIRLINE_PARTNERS: AirlinePartner[] = [
  {
    name: "Qatar Airways",
    logoUrl:
      "https://res.cloudinary.com/tjoy4drq/image/upload/v1795596905/Qatar_Airways_logo.svg.webp",
  },
  {
    name: "Turkish Airlines",
    logoUrl:
      "https://res.cloudinary.com/tjoy4drq/image/upload/v1795596904/Turkish_Airlines_logo_2019_compact.svg.webp",
  },
  {
    name: "Emirates",
    logoUrl:
      "https://res.cloudinary.com/tjoy4drq/image/upload/v1795596904/Emirates_logo.svg.webp",
  },
  {
    name: "Pakistan International Airlines",
    logoUrl:
      "https://res.cloudinary.com/tjoy4drq/image/upload/v1795596904/Pakistan_International_Airlines_Logo.svg.webp",
  },
  {
    name: "Etihad Airways",
    logoUrl:
      "https://res.cloudinary.com/tjoy4drq/image/upload/v1795596904/Etihad-airways-logo.svg.webp",
  },
  {
    name: "Airblue",
    logoUrl:
      "https://res.cloudinary.com/tjoy4drq/image/upload/v1795596904/Airblue_Logo.svg.webp",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How far in advance should I book my flight?",
    answer:
      "For the best prices, we recommend booking domestic flights 1-3 months in advance and international flights 2-8 months in advance. However, our Airfare Masters team can always help you find last-minute deals!",
  },
  {
    question: "What documents do I need for international travel?",
    answer:
      "You need a valid passport with at least 6 months of validity beyond your return date, a valid visa or e-visa for your destination (and transit country if applicable), confirmed return or onward flight tickets, and any required travel insurance or vaccination certificates.",
  },
  {
    question: "Can I change or cancel my booking?",
    answer:
      "Yes, date changes, route modifications, and cancellations are handled according to your selected airline's fare rules. Reach out to our 24/7 Airfare Masters helpline at +92 308 4813513 or WhatsApp us anytime for quick assistance.",
  },
];

export default function TicketingBottomSections({
  onBookFlightClick,
}: TicketingBottomSectionsProps) {
  const statsSectionRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);
  const [counts, setCounts] = useState<number[]>(() =>
    JOURNEY_STATS.map(() => 0)
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const targetEl = statsSectionRef.current;
    if (!targetEl) return;

    let rafId = 0;

    // Compute today's live targets based on elapsed days since anchor date
    const elapsedDays = Math.max(
      0,
      Math.floor((Date.now() - ANCHOR_TIMESTAMP_UTC) / MS_PER_DAY)
    );
    const liveTargets = JOURNEY_STATS.map(
      (stat) => stat.baseTarget + elapsedDays * stat.dailyIncrement
    );

    const startCountAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const durationMs = 2100;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setCounts(liveTargets.map((target) => Math.round(target * eased)));

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCountAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(targetEl);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full text-white">
      {/* 1. The Smartest Way to Travel */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Smartest Way to Travel
          </h2>
          <div className="w-12 h-1 rounded-full bg-sky-500 mx-auto mt-3.5" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SMART_TRAVEL_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl bg-[#0b172a]/90 hover:bg-[#0e1e36] border border-white/10 hover:border-sky-400/40 p-8 text-center shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-6">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Our Journey in Numbers (Balanced Royal-Blue Theme + Non-Italic Stylish Typography + Daily Growth) */}
      <section
        ref={statsSectionRef}
        className="relative w-full overflow-hidden border-y border-sky-400/20 bg-gradient-to-r from-[#0c264d] via-[#143d75] to-[#0c264d] py-20"
      >
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_25%,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_78%_75%,rgba(14,165,233,0.12),transparent_55%)]"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="text-center">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-sky-300/25 text-sky-200 text-[10px] font-bold tracking-[0.22em] uppercase mb-3">
              AIRFARE MASTERS MILESTONES
            </span>

            <h2
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              className="text-3xl sm:text-5xl font-bold text-white tracking-wide drop-shadow-[0_4px_16px_rgba(4,9,22,0.45)]"
            >
              Our Journey{" "}
              <span className="font-extrabold bg-gradient-to-r from-sky-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
                in Numbers
              </span>
            </h2>

            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-8 h-0.5 rounded-full bg-sky-300/40" />
              <span className="w-2.5 h-2.5 rotate-45 bg-sky-400" />
              <span className="w-8 h-0.5 rounded-full bg-sky-300/40" />
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7 text-center">
            {JOURNEY_STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-3xl bg-[#061329]/55 hover:bg-[#061329]/75 backdrop-blur-md border border-sky-300/15 px-4 py-7 sm:px-6 sm:py-8 shadow-[0_12px_32px_rgba(4,9,22,0.3)] transition-all duration-300 hover:-translate-y-1"
              >
                <div>{stat.icon}</div>
                <div className="mt-4 text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-sky-400 tracking-tight tabular-nums">
                  {counts[idx].toLocaleString("en-US")}
                </div>
                <div className="mt-2 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-slate-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Our Airline Partners (Infinite Marquee: Monochrome by default, Real Color on Hover) */}
      <section className="w-full py-20 overflow-hidden bg-[#040916]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Airline Partners
          </h2>
          <div className="w-12 h-1 rounded-full bg-sky-500 mx-auto mt-3.5" />
        </div>

        {/* Marquee Keyframes */}
        <style jsx>{`
          @keyframes airlineMarquee {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          .airline-marquee-track {
            display: flex;
            width: max-content;
            animation: airlineMarquee 28s linear infinite;
          }
          .airline-marquee-wrapper:hover .airline-marquee-track {
            animation-play-state: paused;
          }
        `}</style>

        <div className="airline-marquee-wrapper relative mt-12 w-full overflow-hidden">
          {/* Left & Right Edge Fade Masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#040916] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#040916] to-transparent"
          />

          <div className="airline-marquee-track items-center gap-8 sm:gap-12 py-3">
            {[...AIRLINE_PARTNERS, ...AIRLINE_PARTNERS].map((airline, idx) => (
              <div
                key={`${airline.name}-${idx}`}
                title={airline.name}
                className="group relative flex items-center justify-center w-44 sm:w-52 h-24 px-6 rounded-2xl bg-white/[0.03] hover:bg-white border border-white/10 hover:border-sky-400/60 shadow-md hover:shadow-[0_12px_32px_rgba(56,189,248,0.28)] transition-all duration-300 cursor-pointer shrink-0"
              >
                <img
                  src={airline.logoUrl}
                  alt={airline.name}
                  loading="lazy"
                  className="max-h-11 sm:max-h-12 w-auto object-contain brightness-0 invert opacity-65 group-hover:filter-none group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-1 rounded-full bg-sky-500 mx-auto mt-3.5" />
        </div>

        <div className="mt-10 space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-[#0b172a]/90 border border-white/10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className={`w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    isOpen
                      ? "bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white"
                      : "bg-transparent hover:bg-white/[0.04] text-white"
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 py-5 text-sm text-slate-300 leading-relaxed bg-[#0b172a] border-t border-white/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Ready for Your Next Adventure? CTA Banner */}
      <section className="w-full mt-8 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#071934] border-t border-white/10 py-20 px-6 sm:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready for Your Next Adventure?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-sky-100/90 max-w-xl mx-auto leading-relaxed">
            Let&apos;s find the perfect flight for you. Book now and start your
            journey with Airfare Masters.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={onBookFlightClick}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-[#0B132B] font-bold text-sm sm:text-base shadow-[0_12px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_36px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Book Your Flight Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}