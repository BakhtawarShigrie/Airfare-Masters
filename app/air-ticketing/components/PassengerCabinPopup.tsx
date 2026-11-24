"use client";

import React, { useEffect, useRef } from "react";

export type CabinClass =
  | "Economy"
  | "Premium Economy"
  | "Business"
  | "First Class";

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerCabinPopupProps {
  isOpen: boolean;
  onClose: () => void;
  passengers: PassengerCounts;
  onChangePassengers: (updated: PassengerCounts) => void;
  cabinClass: CabinClass;
  onChangeCabinClass: (cabin: CabinClass) => void;
}

const CABIN_OPTIONS: CabinClass[] = [
  "Economy",
  "Premium Economy",
  "Business",
  "First Class",
];

const MAX_TOTAL_PASSENGERS = 9;

export default function PassengerCabinPopup({
  isOpen,
  onClose,
  passengers,
  onChangePassengers,
  cabinClass,
  onChangeCabinClass,
}: PassengerCabinPopupProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalCount =
    passengers.adults + passengers.children + passengers.infants;

  const updateCount = (key: keyof PassengerCounts, delta: number) => {
    const currentVal = passengers[key];
    const nextVal = currentVal + delta;

    if (key === "adults" && nextVal < 1) return;
    if (key !== "adults" && nextVal < 0) return;
    if (delta > 0 && totalCount >= MAX_TOTAL_PASSENGERS) return;

    // Infants cannot exceed adults
    if (key === "infants" && nextVal > passengers.adults) return;

    const updated: PassengerCounts = {
      ...passengers,
      [key]: nextVal,
    };

    if (key === "adults" && updated.infants > updated.adults) {
      updated.infants = updated.adults;
    }

    onChangePassengers(updated);
  };

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-label="Select Passengers and Cabin Class"
      className="absolute right-0 top-full mt-2.5 z-50 w-full sm:w-[360px] rounded-2xl bg-[#0c1a2e] border border-white/15 shadow-[0_20px_55px_rgba(0,0,0,0.75)] p-5 text-white"
    >
      {/* Passengers Section */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-xs font-bold tracking-wider uppercase text-sky-400">
          Passengers
        </span>
        <span className="text-[11px] text-slate-400">
          Max {MAX_TOTAL_PASSENGERS} travelers
        </span>
      </div>

      <div className="divide-y divide-white/10">
        {/* Adults */}
        <div className="py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Adults</div>
            <div className="text-xs text-slate-400">12+ years</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateCount("adults", -1)}
              disabled={passengers.adults <= 1}
              aria-label="Decrease adults"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            >
              &minus;
            </button>
            <span className="w-5 text-center text-sm font-bold">
              {passengers.adults}
            </span>
            <button
              type="button"
              onClick={() => updateCount("adults", 1)}
              disabled={totalCount >= MAX_TOTAL_PASSENGERS}
              aria-label="Increase adults"
              className="w-8 h-8 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/30 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center font-bold text-sm text-sky-300 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Children</div>
            <div className="text-xs text-slate-400">2 &ndash; 11 years</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateCount("children", -1)}
              disabled={passengers.children <= 0}
              aria-label="Decrease children"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            >
              &minus;
            </button>
            <span className="w-5 text-center text-sm font-bold">
              {passengers.children}
            </span>
            <button
              type="button"
              onClick={() => updateCount("children", 1)}
              disabled={totalCount >= MAX_TOTAL_PASSENGERS}
              aria-label="Increase children"
              className="w-8 h-8 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/30 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center font-bold text-sm text-sky-300 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Infants</div>
            <div className="text-xs text-slate-400">Under 2 years</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateCount("infants", -1)}
              disabled={passengers.infants <= 0}
              aria-label="Decrease infants"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            >
              &minus;
            </button>
            <span className="w-5 text-center text-sm font-bold">
              {passengers.infants}
            </span>
            <button
              type="button"
              onClick={() => updateCount("infants", 1)}
              disabled={
                totalCount >= MAX_TOTAL_PASSENGERS ||
                passengers.infants >= passengers.adults
              }
              aria-label="Increase infants"
              className="w-8 h-8 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/30 disabled:opacity-35 disabled:pointer-events-none flex items-center justify-center font-bold text-sm text-sky-300 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Cabin Class Section */}
      <div className="pt-3 mt-1 border-t border-white/10">
        <div className="text-xs font-bold tracking-wider uppercase text-amber-300 mb-2.5">
          Cabin Class
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CABIN_OPTIONS.map((option) => {
            const active = cabinClass === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChangeCabinClass(option)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-sky-500 text-slate-950 border-sky-400 shadow-sm"
                    : "bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 border-white/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Done Button */}
      <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold tracking-wide transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}