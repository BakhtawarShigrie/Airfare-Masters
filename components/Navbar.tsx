"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem =
  | { label: string; href: string; modal?: undefined }
  | { label: string; modal: "about" | "contact"; href?: undefined };

type ModalType = "about" | "contact" | "call" | null;

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Air Ticketing", href: "/air-ticketing" },
  { label: "Visa", href: "/visa" },
  { label: "World Tours", href: "/tours" },
  { label: "About Us", modal: "about" },
  { label: "Contact", modal: "contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setIsMobileMenuOpen(false);
      }
    };

    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const openModal = (modal: Exclude<ModalType, null>) => {
    setIsMobileMenuOpen(false);
    setActiveModal(modal);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/75 backdrop-blur-md py-3 shadow-lg border-b border-white/10"
            : "bg-transparent py-5"
        }`}
      >
        <div className="relative w-full pl-6 sm:pl-10 lg:pl-14 pr-6 sm:pr-10 lg:pr-14 flex items-center justify-between">
          {/* Left: Airfare Masters White Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus:outline-none z-10"
            aria-label="Airfare Masters Home"
          >
            <Image
              src="/logo-white.png"
              alt="Airfare Masters"
              width={170}
              height={44}
              priority
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Exact Center: Compact Dark Frosted Pill Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-5 xl:gap-6 px-6 py-2.5 rounded-full bg-neutral-900/55 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10 whitespace-nowrap"
          >
            {NAV_ITEMS.map((item) => {
              if (item.modal) {
                const isModalOpen = activeModal === item.modal;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => openModal(item.modal!)}
                    className={`text-[13px] xl:text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                      isModalOpen
                        ? "text-white font-semibold"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] xl:text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Desktop CALL NOW Button (Hidden on Mobile) + Mobile Menu Button */}
          <div className="flex items-center gap-2.5 z-10">
            <button
              type="button"
              onClick={() => openModal("call")}
              className="hidden lg:inline-flex group items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B132B] text-xs font-bold tracking-wider uppercase shadow-[0_6px_20px_rgba(0,0,0,0.22)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)] transition-all duration-200 cursor-pointer"
            >
              <span>CALL NOW</span>
              <span
                aria-hidden="true"
                className="text-sm leading-none transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900/65 backdrop-blur-md border border-white/15 text-white hover:bg-neutral-800/85 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-6 sm:px-10 pt-3 pb-4">
            <div className="rounded-3xl bg-neutral-950/90 backdrop-blur-xl border border-white/15 p-5 shadow-2xl space-y-2">
              {NAV_ITEMS.map((item) => {
                if (item.modal) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => openModal(item.modal!)}
                      className="w-full text-left block px-4 py-2.5 rounded-xl text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-1.5 px-4 text-xs text-white/70">
                <a
                  href="tel:+923084813513"
                  className="hover:text-white transition-colors"
                >
                  Phone &amp; WhatsApp: +92 308 4813513
                </a>
                <a
                  href="mailto:info.aifaremasters@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Email: info.aifaremasters@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Call Now Popup ("Connect Instantly") */}
      {activeModal === "call" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect Instantly with Airfare Masters"
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-[#0c1a2e] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.75)] overflow-hidden text-white"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close Connect Instantly popup"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Top Gradient Header */}
            <div className="bg-gradient-to-b from-[#152d4e] to-[#0c1a2e] px-6 sm:px-7 pt-7 pb-5 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-amber-400/25 text-amber-300 text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>DIRECT TRAVEL DESK &bull; LAHORE</span>
              </div>

              <h2 className="text-2xl sm:text-[26px] font-bold text-white mt-3.5 tracking-tight">
                Connect Instantly
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 mt-1.5 leading-relaxed">
                Speak with our travel agents for flights, visas &amp; world tour
                packages.
              </p>
            </div>

            {/* Action Cards */}
            <div className="px-6 sm:px-7 py-6 space-y-3.5">
              {/* Primary Bright Blue Helpline Card */}
              <a
                href="tel:+923084813513"
                className="group w-full p-4 rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#38bdf8] hover:to-[#0ea5e9] text-white flex items-center justify-between transition-all duration-200 shadow-[0_10px_28px_rgba(14,165,233,0.35)]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-white/90">
                      MOBILE HELPLINE
                    </div>
                    <div className="text-base sm:text-lg font-extrabold tracking-tight mt-0.5">
                      +92 308 4813513
                    </div>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="text-base font-semibold transition-transform duration-200 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>

              {/* Secondary Dark Official Email Card */}
              <a
                href="mailto:info.aifaremasters@gmail.com"
                className="group w-full p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-white flex items-center justify-between transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                      OFFICIAL EMAIL DESK
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                      info.aifaremasters@gmail.com
                    </div>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="text-base text-slate-400 group-hover:text-white transition-all duration-200 group-hover:translate-x-1 shrink-0 ml-2"
                >
                  &rarr;
                </span>
              </a>

              {/* Green Message on WhatsApp Button */}
              <a
                href="https://wa.me/923084813513"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm sm:text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_10px_25px_rgba(34,197,94,0.3)]"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                </svg>
                <span>Message on WhatsApp</span>
              </a>

              {/* Footer Location Tag */}
              <div className="pt-1 text-center text-[11px] text-slate-400">
                Lahore, Pakistan &bull; Worldwide Air Ticketing Desk
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {activeModal === "about" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="About Airfare Masters"
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-[#0c1a2e] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden text-white"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close About Us modal"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Top Gradient Header */}
            <div className="bg-gradient-to-b from-[#142c4c] to-[#0c1a2e] px-6 sm:px-8 pt-7 pb-6 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/25 text-amber-300 text-[11px] font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>TRUSTED TRAVEL PARTNER</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
                Airfare Masters
              </h2>
              <p className="text-xs sm:text-sm text-sky-400 font-medium mt-1">
                Worldwide Air Ticketing &bull; Visit Visas &bull; World Tours
                &bull; Hotel Reservations
              </p>
            </div>

            {/* Body Content */}
            <div className="px-6 sm:px-8 py-6 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed">
                <strong className="text-white font-semibold">
                  Airfare Masters
                </strong>{" "}
                delivers reliable, end-to-end global travel solutions &mdash;
                from competitive{" "}
                <span className="text-amber-300 font-medium">
                  Domestic &amp; International Air Ticketing
                </span>{" "}
                to worldwide visit visas and customized holiday packages.
              </p>

              <p className="text-sm text-slate-300 leading-relaxed">
                Our dedicated aviation and travel specialists handle airline
                reservations, fare comparisons, visa documentation, and hotel
                bookings with complete transparency so every journey stays
                smooth and stress-free.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Expert Travel Desk
                    </div>
                    <div className="text-xs text-slate-400">
                      Air Ticketing &amp; Visas
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      24/7 Support
                    </div>
                    <div className="text-xs text-slate-400">
                      Always Available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-[#091424] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <svg
                  className="w-4 h-4 text-rose-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>
                  Lahore, Pakistan &bull; Worldwide Air Ticketing Desk
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal("contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0ea5e9] hover:bg-[#38bdf8] text-slate-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span>Talk to Our Team</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === "contact" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Contact Airfare Masters"
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1a2e] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.65)] text-white grid grid-cols-1 md:grid-cols-12"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close Contact modal"
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/85 hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Left Column: Contact Info */}
            <div className="md:col-span-5 bg-gradient-to-b from-[#132946] to-[#0d1e36] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/25 text-amber-300 text-[11px] font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>AIRFARE MASTERS DESK</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3.5 tracking-tight">
                  Get In Touch
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Connect directly with our Air Ticketing, Visa &amp; World Tour
                  consultants for instant flight fares and bookings.
                </p>

                <div className="space-y-5 mt-7">
                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
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
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                        PHONE &amp; WHATSAPP
                      </div>
                      <a
                        href="tel:+923084813513"
                        className="block text-sm font-bold text-white hover:text-sky-300 transition-colors mt-0.5"
                      >
                        +92 308 4813513
                      </a>
                    </div>
                  </div>

                  {/* Official Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
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
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                        OFFICIAL EMAIL
                      </div>
                      <a
                        href="mailto:info.aifaremasters@gmail.com"
                        className="block text-sm font-semibold text-white hover:text-sky-300 transition-colors mt-0.5 break-all"
                      >
                        info.aifaremasters@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
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
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                        SERVICE DESK
                      </div>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        Lahore, Pakistan
                      </p>
                      <p className="text-xs text-slate-400">
                        Global Flight &amp; Travel Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Instant Action CTAs */}
            <div className="md:col-span-7 bg-[#091424] p-6 sm:p-8 flex flex-col justify-center">
              <div className="text-[11px] font-bold tracking-widest uppercase text-sky-400">
                FAST RESPONSE SUPPORT
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
                Connect Instantly
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Skip the wait &mdash; message our travel consultants on
                WhatsApp or call directly for flight fares, visa guidance, and
                tour quotes.
              </p>

              <div className="space-y-3.5 mt-6">
                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/923084813513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full p-4 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-between transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold leading-tight">
                        Chat on WhatsApp
                      </div>
                      <div className="text-xs text-white/90 mt-0.5">
                        Instant replies from our Lahore team
                      </div>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </a>

                {/* Direct Call CTA */}
                <a
                  href="tel:+923084813513"
                  className="group w-full p-4 rounded-2xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white flex items-center justify-between transition-all duration-200 shadow-lg shadow-sky-500/20"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
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
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold leading-tight">
                        Call +92 308 4813513
                      </div>
                      <div className="text-xs text-white/90 mt-0.5">
                        Direct Mobile &amp; Booking Helpline
                      </div>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </a>

                {/* Bottom Quick Pill Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://wa.me/923084813513"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white/90 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="text-emerald-400">&#9742;</span>
                    <span>+92 308 4813513</span>
                  </a>

                  <a
                    href="mailto:info.aifaremasters@gmail.com"
                    className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white/90 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="text-amber-400">&#9993;</span>
                    <span>Send an Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}