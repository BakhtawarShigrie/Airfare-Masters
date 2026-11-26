"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TourPackage } from "../types";

interface TourDetailViewProps {
  tour: TourPackage;
}

export default function TourDetailView({ tour }: TourDetailViewProps) {
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);

  const [travelerName, setTravelerName] = useState<string>("");
  const [travelerPhone, setTravelerPhone] = useState<string>("");
  const [travelersCount, setTravelersCount] = useState<string>("2");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [customNotes, setCustomNotes] = useState<string>("");

  const activePlan = tour.plans[selectedPlanIdx] || tour.plans[0];

  const whatsappDirectUrl = `https://wa.me/923084813513?text=${encodeURIComponent(
    `Assalam-o-Alaikum Airfare Masters! I am interested in:\n• *Package:* ${activePlan.title}\n• *Duration:* ${activePlan.duration}\n• *Price:* ${activePlan.price}\nPlease share booking details.`
  )}`;

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "*Airfare Masters - Tour Booking Request*",
      `• *Tour Package:* ${activePlan.title}`,
      `• *Duration:* ${activePlan.duration}`,
      `• *Package Price:* ${activePlan.price} per person`,
      `• *Full Name:* ${travelerName || "Not provided"}`,
      `• *Contact Number:* ${travelerPhone || "Not provided"}`,
      `• *No. of Travelers:* ${travelersCount}`,
    ];
    if (preferredDate) lines.push(`• *Preferred Date:* ${preferredDate}`);
    if (customNotes.trim()) lines.push(`• *Notes:* ${customNotes.trim()}`);

    window.open(
      `https://wa.me/923084813513?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsRequestModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#040916] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Back Breadcrumb */}
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors mb-6"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to All World Tours</span>
        </Link>

        {/* Plan Selector (Shown when a destination has multiple plans like Uzbekistan) */}
        {tour.plans.length > 1 && (
          <div className="mb-8 p-2 rounded-2xl bg-[#0b172a] border border-white/15 inline-flex flex-wrap gap-2">
            {tour.plans.map((plan, idx) => {
              const isSelected = idx === selectedPlanIdx;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanIdx(idx)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {plan.planLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* Hero Title Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0c2244] via-[#102e5c] to-[#091830] border border-white/15 p-7 sm:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              {tour.location}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              {activePlan.duration}
            </span>
          </div>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {activePlan.title}
            </h1>
            <div className="shrink-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Price Per Person
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 mt-0.5">
                {activePlan.price}
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Overview, Itinerary, Included, Excluded, Important Notes */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <section className="rounded-3xl bg-[#0b172a]/90 border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-3.5">
                Overview
              </h2>
              <div className="mt-4 space-y-3.5 text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                {activePlan.overviewParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {activePlan.extraOverviewBlocks?.map((block) => (
                <div
                  key={block.heading}
                  className="mt-6 rounded-2xl bg-white/[0.03] border border-white/10 p-5"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-3">
                    {block.heading}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-sky-400 font-bold">&bull;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Day-by-Day Itinerary */}
            <section className="rounded-3xl bg-[#0b172a]/90 border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-3.5">
                Day-Wise Itinerary
              </h2>

              <div className="mt-6 space-y-4">
                {activePlan.itinerary.map((day, idx) => (
                  <div
                    key={day.dayTitle}
                    className="rounded-2xl bg-white/[0.03] border border-white/10 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {day.dayTitle}
                      </h3>
                    </div>

                    <ul className="mt-3.5 space-y-2 pl-10 text-sm text-slate-300">
                      {day.activities.map((act) => (
                        <li key={act} className="flex items-start gap-2">
                          <span className="text-sky-400 mt-1">&#8226;</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* What's Included */}
            <section className="rounded-3xl bg-[#0b172a]/90 border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-3.5">
                What&apos;s Included
              </h2>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
                {activePlan.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-400/20 p-3.5"
                  >
                    <span className="text-emerald-400 font-bold">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What's Excluded */}
            {activePlan.excluded.length > 0 && (
              <section className="rounded-3xl bg-[#0b172a]/90 border border-white/10 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-3.5">
                  What&apos;s Excluded
                </h2>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                  {activePlan.excluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl bg-rose-500/[0.05] border border-rose-400/20 p-3.5"
                    >
                      <span className="text-rose-400 font-bold">&times;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {activePlan.excludedNote && (
                  <p className="mt-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-400/25 rounded-xl p-3.5">
                    Note: {activePlan.excludedNote}
                  </p>
                )}
              </section>
            )}

            {/* Important Notes */}
            <section className="rounded-3xl bg-[#0b172a]/90 border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-3.5">
                Important Notes
              </h2>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
                {activePlan.importantNotes.map((note) => (
                  <li key={note} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold mt-0.5">!</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right 4 Columns: Sticky Tour Price, Tour Details & Booking Actions */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Tour Price Card */}
            <div className="rounded-3xl bg-[#0b172a] border border-sky-400/30 p-6 sm:p-7 shadow-xl">
              <div className="text-xs font-bold tracking-widest uppercase text-sky-400">
                TOUR PRICE
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Price per Person:
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {activePlan.price}
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Contact us for group discounts and special offers.
              </p>

              {/* Tour Details Summary */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3.5 text-sm">
                <div className="text-xs font-bold tracking-widest uppercase text-amber-300">
                  TOUR DETAILS
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-white">
                    {activePlan.duration}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-white">
                    {tour.location}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Departure:</span>
                  <span className="font-semibold text-white">
                    {activePlan.departure}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Best For:</span>
                  <span className="font-semibold text-white">
                    {activePlan.bestFor}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-slate-400">Tour Type:</span>
                  <span className="font-semibold text-sky-300">
                    {activePlan.tourType}
                  </span>
                </div>
              </div>

              {/* Interested CTAs */}
              <div className="mt-7 pt-6 border-t border-white/10 space-y-3">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-400">
                  INTERESTED?
                </div>

                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/30 transition-all cursor-pointer"
                >
                  Request Tour
                </button>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Request Tour Modal */}
      {isRequestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request Tour Package"
          onClick={() => setIsRequestModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-[#0c1a2e] border border-white/15 p-6 sm:p-7 text-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            >
              &times;
            </button>

            <div className="text-[11px] font-bold tracking-widest uppercase text-sky-400">
              AIRFARE MASTERS TOUR DESK
            </div>
            <h3 className="text-xl font-bold mt-1">{activePlan.title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {activePlan.duration} &bull; {activePlan.price} per person
            </p>

            <form onSubmit={handleRequestSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-sky-400 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-sky-400 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    No. of Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-sky-400 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-sky-400 focus:outline-none text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Room preference, departure city, or questions..."
                  className="w-full p-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-sky-400 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Send Inquiry on WhatsApp &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}