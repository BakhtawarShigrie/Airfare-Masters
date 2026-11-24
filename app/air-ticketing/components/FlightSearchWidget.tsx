"use client";

import React, { useState, useEffect } from "react";
import PassengerCabinPopup, {
  CabinClass,
  PassengerCounts,
} from "./PassengerCabinPopup";

type TripType = "round-trip" | "one-way" | "multi-city";

interface FlightLeg {
  id: string;
  from: string;
  to: string;
  date: string;
}

const POPULAR_AIRPORTS = [
  "Lahore (LHE) - Allama Iqbal Intl",
  "Islamabad (ISB) - Islamabad Intl",
  "Karachi (KHI) - Jinnah Intl",
  "Dubai (DXB) - Dubai Intl",
  "Abu Dhabi (AUH) - Zayed Intl",
  "Sharjah (SHJ) - Sharjah Intl",
  "Jeddah (JED) - King Abdulaziz Intl",
  "Riyadh (RUH) - King Khalid Intl",
  "Doha (DOH) - Hamad Intl",
  "Istanbul (IST) - Istanbul Airport",
  "London (LHR) - Heathrow",
  "Manchester (MAN) - Manchester Airport",
  "Toronto (YYZ) - Pearson Intl",
  "New York (JFK) - John F. Kennedy",
  "Kuala Lumpur (KUL) - KLIA",
  "Bangkok (BKK) - Suvarnabhumi",
  "Baku (GYD) - Heydar Aliyev Intl",
  "Tashkent (TAS) - Islam Karimov Intl",
];

function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function FlightSearchWidget() {
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [minDate, setMinDate] = useState<string>("");

  const [fromCity, setFromCity] = useState<string>(
    "Lahore (LHE) - Allama Iqbal Intl"
  );
  const [toCity, setToCity] = useState<string>("Dubai (DXB) - Dubai Intl");
  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  const [multiLegs, setMultiLegs] = useState<FlightLeg[]>([
    {
      id: "leg-1",
      from: "Lahore (LHE) - Allama Iqbal Intl",
      to: "Dubai (DXB) - Dubai Intl",
      date: "",
    },
    {
      id: "leg-2",
      from: "Dubai (DXB) - Dubai Intl",
      to: "London (LHR) - Heathrow",
      date: "",
    },
  ]);

  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");
  const [isPassengerPopupOpen, setIsPassengerPopupOpen] =
    useState<boolean>(false);

  const [fullName, setFullName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string>("");

  // Initialize SSR-safe dates on client mount so past dates are disabled
  useEffect(() => {
    const today = new Date();
    const todayStr = formatDateISO(today);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekStr = formatDateISO(nextWeek);

    const tenDays = new Date(today);
    tenDays.setDate(today.getDate() + 10);
    const tenDaysStr = formatDateISO(tenDays);

    setMinDate(todayStr);
    setDepartureDate(nextWeekStr);
    setReturnDate(tenDaysStr);
    setMultiLegs([
      {
        id: "leg-1",
        from: "Lahore (LHE) - Allama Iqbal Intl",
        to: "Dubai (DXB) - Dubai Intl",
        date: nextWeekStr,
      },
      {
        id: "leg-2",
        from: "Dubai (DXB) - Dubai Intl",
        to: "London (LHR) - Heathrow",
        date: tenDaysStr,
      },
    ]);
  }, []);

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleDepartureChange = (val: string) => {
    setDepartureDate(val);
    if (returnDate && val > returnDate) {
      setReturnDate(val);
    }
  };

  const updateMultiLeg = (
    id: string,
    field: keyof Omit<FlightLeg, "id">,
    value: string
  ) => {
    setMultiLegs((prev) =>
      prev.map((leg) => (leg.id === id ? { ...leg, [field]: value } : leg))
    );
  };

  const addMultiLeg = () => {
    if (multiLegs.length >= 5) return;
    const lastLeg = multiLegs[multiLegs.length - 1];
    setMultiLegs((prev) => [
      ...prev,
      {
        id: `leg-${Date.now()}`,
        from: lastLeg?.to || "",
        to: "",
        date: lastLeg?.date || minDate,
      },
    ]);
  };

  const removeMultiLeg = (id: string) => {
    if (multiLegs.length <= 2) return;
    setMultiLegs((prev) => prev.filter((leg) => leg.id !== id));
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;

  const passengerSummary = `${totalPassengers} Traveler${
    totalPassengers > 1 ? "s" : ""
  }, ${cabinClass}`;

  const handleRequestFare = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMessage("");

    if (tripType !== "multi-city") {
      if (!fromCity.trim() || !toCity.trim() || !departureDate) {
        setValidationMessage(
          "Please select origin, destination, and departure date."
        );
        return;
      }
      if (tripType === "round-trip" && !returnDate) {
        setValidationMessage("Please select a return date for Round Trip.");
        return;
      }
    } else {
      const incomplete = multiLegs.some(
        (leg) => !leg.from.trim() || !leg.to.trim() || !leg.date
      );
      if (incomplete) {
        setValidationMessage(
          "Please fill origin, destination, and date for all Multi-City legs."
        );
        return;
      }
    }

    const lines: string[] = [
      "*Airfare Masters - Flight Fare Inquiry*",
      `• *Trip Type:* ${
        tripType === "round-trip"
          ? "Round Trip"
          : tripType === "one-way"
          ? "One Way"
          : "Multi-City"
      }`,
    ];

    if (tripType === "multi-city") {
      multiLegs.forEach((leg, idx) => {
        lines.push(
          `• *Flight ${idx + 1}:* ${leg.from} → ${leg.to} (${leg.date})`
        );
      });
    } else {
      lines.push(`• *From:* ${fromCity}`);
      lines.push(`• *To:* ${toCity}`);
      lines.push(`• *Departure:* ${departureDate}`);
      if (tripType === "round-trip") {
        lines.push(`• *Return:* ${returnDate}`);
      }
    }

    lines.push(
      `• *Passengers:* ${passengers.adults} Adult(s), ${passengers.children} Child(ren), ${passengers.infants} Infant(s)`
    );
    lines.push(`• *Cabin Class:* ${cabinClass}`);

    if (fullName.trim()) {
      lines.push(`• *Passenger Name:* ${fullName.trim()}`);
    }
    if (contactPhone.trim()) {
      lines.push(`• *Contact:* ${contactPhone.trim()}`);
    }

    const whatsappUrl = `https://wa.me/923084813513?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full rounded-3xl bg-[#0b172a]/95 backdrop-blur-xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.65)] p-6 sm:p-8 lg:p-10 text-white">
      <datalist id="airfare-airports-list">
        {POPULAR_AIRPORTS.map((airport) => (
          <option key={airport} value={airport} />
        ))}
      </datalist>

      {/* Top Header & Trip Type Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-[11px] font-bold tracking-widest uppercase text-sky-400">
            INSTANT RESERVATION DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Book Your Flight
          </h2>
        </div>

        {/* Trip Type Selector */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 self-start">
          {(
            [
              { id: "round-trip", label: "Round Trip" },
              { id: "one-way", label: "One Way" },
              { id: "multi-city", label: "Multi-City" },
            ] as const
          ).map((tab) => {
            const active = tripType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTripType(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleRequestFare} className="mt-6 space-y-6">
        {tripType !== "multi-city" ? (
          /* Round Trip & One Way Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* From */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                Flying From
              </label>
              <input
                type="text"
                list="airfare-airports-list"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="City or Airport (e.g. LHE)"
                className="w-full h-13 px-4 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
              />
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwapCities}
                aria-label="Swap departure and destination cities"
                className="w-11 h-11 rounded-2xl bg-white/[0.06] hover:bg-sky-500/20 border border-white/15 hover:border-sky-400/40 text-sky-300 flex items-center justify-center transition-colors cursor-pointer"
              >
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                Flying To
              </label>
              <input
                type="text"
                list="airfare-airports-list"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Destination (e.g. DXB, LHR)"
                className="w-full h-13 px-4 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
              />
            </div>

            {/* Departure Date */}
            <div
              className={
                tripType === "round-trip" ? "lg:col-span-2" : "lg:col-span-3"
              }
            >
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                Departure
              </label>
              <input
                type="date"
                min={minDate}
                value={departureDate}
                onChange={(e) => handleDepartureChange(e.target.value)}
                className="w-full h-13 px-3.5 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white [color-scheme:dark]"
              />
            </div>

            {/* Return Date (Only for Round Trip) */}
            {tripType === "round-trip" && (
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                  Return
                </label>
                <input
                  type="date"
                  min={departureDate || minDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-13 px-3.5 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white [color-scheme:dark]"
                />
              </div>
            )}
          </div>
        ) : (
          /* Multi-City Legs */
          <div className="space-y-3.5">
            {multiLegs.map((leg, index) => (
              <div
                key={leg.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end p-4 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                    Flight {index + 1} &bull; From
                  </label>
                  <input
                    type="text"
                    list="airfare-airports-list"
                    value={leg.from}
                    onChange={(e) =>
                      updateMultiLeg(leg.id, "from", e.target.value)
                    }
                    placeholder="Origin Airport"
                    className="w-full h-12 px-4 rounded-xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                    To
                  </label>
                  <input
                    type="text"
                    list="airfare-airports-list"
                    value={leg.to}
                    onChange={(e) =>
                      updateMultiLeg(leg.id, "to", e.target.value)
                    }
                    placeholder="Destination Airport"
                    className="w-full h-12 px-4 rounded-xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    min={
                      index > 0 && multiLegs[index - 1].date
                        ? multiLegs[index - 1].date
                        : minDate
                    }
                    value={leg.date}
                    onChange={(e) =>
                      updateMultiLeg(leg.id, "date", e.target.value)
                    }
                    className="w-full h-12 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white [color-scheme:dark]"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end">
                  {multiLegs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeMultiLeg(leg.id)}
                      aria-label={`Remove flight ${index + 1}`}
                      className="w-11 h-12 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/25 text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            ))}

            {multiLegs.length < 5 && (
              <button
                type="button"
                onClick={addMultiLeg}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>+ Add Another Flight</span>
              </button>
            )}
          </div>
        )}

        {/* Second Row: Travelers & Cabin Class, Optional Passenger Details, Submit CTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-2">
          {/* Passenger & Cabin Selector */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              Travelers &amp; Cabin Class
            </label>
            <button
              type="button"
              onClick={() => setIsPassengerPopupOpen((prev) => !prev)}
              className="w-full h-13 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/15 text-left text-sm font-medium text-white flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="truncate">{passengerSummary}</span>
              <svg
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                  isPassengerPopupOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <PassengerCabinPopup
              isOpen={isPassengerPopupOpen}
              onClose={() => setIsPassengerPopupOpen(false)}
              passengers={passengers}
              onChangePassengers={setPassengers}
              cabinClass={cabinClass}
              onChangeCabinClass={setCabinClass}
            />
          </div>

          {/* Passenger Name */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Muhammad Ahmed"
              className="w-full h-13 px-4 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+92 3XX XXXXXXX"
              className="w-full h-13 px-4 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full h-13 px-6 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(14,165,233,0.38)] hover:shadow-[0_14px_34px_rgba(14,165,233,0.55)] transition-all cursor-pointer"
            >
              <span>Get Best Fare</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        {validationMessage && (
          <p className="text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-400/25 rounded-xl px-4 py-2.5">
            {validationMessage}
          </p>
        )}
      </form>
    </div>
  );
}