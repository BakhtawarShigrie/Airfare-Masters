"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { FaPlus, FaTimes, FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AirTicketing() {
  const [tripType, setTripType] = useState("round-trip");
  
  // --- STATE: Multi-City Flights ---
  const [multiFlights, setMultiFlights] = useState<{ id: number; date: Date | null }[]>([
    { id: 1, date: null }, 
    { id: 2, date: null }
  ]);

  // --- STATE: Passengers & Class ---
  const [showPassengerPopup, setShowPassengerPopup] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [flightClass, setFlightClass] = useState("Economy");

  // --- STATE: Calendar ---
  const [activeCalendar, setActiveCalendar] = useState<string | number | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  
  const [today, setToday] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    setToday(currentDate);
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
  }, []);

  // --- HANDLERS: Multi-City ---
  const addFlight = () => {
    if (multiFlights.length < 6) setMultiFlights([...multiFlights, { id: Date.now(), date: null }]);
  };
  const removeFlight = (id: number) => {
    if (multiFlights.length > 2) setMultiFlights(multiFlights.filter(flight => flight.id !== id));
  };

  // --- HANDLERS: Passengers ---
  const handlePassengerChange = (type: string, operation: string) => {
    if (type === "adults") {
      if (operation === "add" && adults < 9) setAdults(adults + 1);
      if (operation === "sub" && adults > 1) setAdults(adults - 1);
    }
    if (type === "children") {
      if (operation === "add" && children < 9) setChildren(children + 1);
      if (operation === "sub" && children > 0) setChildren(children - 1);
    }
    if (type === "infants") {
      if (operation === "add" && infants < 9) setInfants(infants + 1);
      if (operation === "sub" && infants > 0) setInfants(infants - 1);
    }
  };
  const totalPassengers = adults + children + infants;

  // --- HANDLERS: Calendar ---
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  };
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  };

  const handleDateSelect = (selectedDate: Date, isMultiCityId?: number) => {
    if (!today || selectedDate < today) return; // Cannot select past dates

    if (isMultiCityId) {
      setMultiFlights(flights => flights.map(f => f.id === isMultiCityId ? { ...f, date: selectedDate } : f));
      setActiveCalendar(null);
    } else {
      if (tripType === "one-way") {
        setDepartureDate(selectedDate);
        setActiveCalendar(null);
      } else {
        if (!departureDate || (departureDate && returnDate)) {
          setDepartureDate(selectedDate);
          setReturnDate(null);
        } else if (selectedDate >= departureDate) {
          setReturnDate(selectedDate);
          setActiveCalendar(null);
        } else {
          setDepartureDate(selectedDate);
        }
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // --- REUSABLE COMPONENTS ---
  const passengerPopupContent = (
    <div 
      className="absolute top-full right-0 lg:left-0 mt-3 w-80 bg-[#0a1120]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 z-50 cursor-default"
      onClick={(e) => e.stopPropagation()} // FIX: Stop clicks from closing popup
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div><p className="font-semibold text-sm text-white">Adults</p><p className="text-xs text-gray-400">12+ years</p></div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => handlePassengerChange("adults", "sub")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><FaMinus size={10} /></button>
            <span className="w-4 text-center">{adults}</span>
            <button type="button" onClick={() => handlePassengerChange("adults", "add")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><FaPlus size={10} /></button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div><p className="font-semibold text-sm text-white">Children</p><p className="text-xs text-gray-400">2-11 years</p></div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => handlePassengerChange("children", "sub")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><FaMinus size={10} /></button>
            <span className="w-4 text-center">{children}</span>
            <button type="button" onClick={() => handlePassengerChange("children", "add")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><FaPlus size={10} /></button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div><p className="font-semibold text-sm text-white">Infants</p><p className="text-xs text-gray-400">Under 2 years</p></div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => handlePassengerChange("infants", "sub")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><FaMinus size={10} /></button>
            <span className="w-4 text-center">{infants}</span>
            <button type="button" onClick={() => handlePassengerChange("infants", "add")} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><FaPlus size={10} /></button>
          </div>
        </div>
      </div>

      <hr className="border-white/10 mb-4" />

      <p className="font-semibold text-sm text-white mb-3">Cabin Class</p>
      <div className="flex flex-wrap gap-2">
        {["Economy", "Premium Economy", "Business", "Customized"].map((cls) => (
          <button 
            key={cls} 
            type="button" 
            onClick={() => setFlightClass(cls)} 
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${flightClass === cls ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-transparent border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/5"}`}
          >
            {cls}
          </button>
        ))}
      </div>
      
      {flightClass === "Customized" && (
        <p className="mt-3 text-[10px] text-amber-400 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20 leading-relaxed">
          * Customized: You can select a different cabin class for each passenger during the next step.
        </p>
      )}
    </div>
  );

  const renderMonth = (monthOffset: number, multiCityId?: number) => {
    let m = currentMonth + monthOffset;
    let y = currentYear;
    if (m > 11) { m -= 12; y += 1; }
    
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
      <div className="flex-1 w-full min-w-[240px]">
        <div className="font-bold text-center mb-4 text-blue-300">{monthNames[m]} {y}</div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
          {dayNames.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm text-center">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateObj = new Date(y, m, day);
            const isPast = today ? dateObj < today : false; 
            
            let isDep = false, isRet = false, inRange = false;

            if (multiCityId) {
              const fDate = multiFlights.find(f => f.id === multiCityId)?.date;
              isDep = !!(fDate && dateObj.getTime() === fDate.getTime());
            } else {
              isDep = !!(departureDate && dateObj.getTime() === departureDate.getTime());
              isRet = !!(returnDate && dateObj.getTime() === returnDate.getTime());
              inRange = !!(departureDate && returnDate && dateObj > departureDate && dateObj < returnDate);
            }

            let bgClass = "hover:bg-white/10";
            let textClass = isPast ? "text-gray-600 cursor-not-allowed" : "text-white cursor-pointer";
            
            if (isDep || isRet) {
              bgClass = "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)]";
              textClass = "text-white font-bold";
            } else if (inRange) {
              bgClass = "bg-blue-600/30";
            }

            return (
              <div 
                key={day} 
                onClick={() => !isPast && handleDateSelect(dateObj, multiCityId)}
                className={`py-2 rounded-lg transition-all ${bgClass} ${textClass}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!today) return <div className="min-h-screen bg-[#050b14]" />;

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-[#111827] via-[#050b14] to-[#1e1b4b] text-white">
      
      <Navbar />

      {/* Global Overlay */}
      {(showPassengerPopup || activeCalendar !== null) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowPassengerPopup(false); setActiveCalendar(null); }} />
      )}

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 pt-32 pb-20">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-lg mb-4">
            Search Flights
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Find the best deals on flights worldwide. Enter your destination and let us take you there.
          </p>
        </div>

        <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 relative z-50">
          
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button type="button" onClick={() => { setTripType("round-trip"); setReturnDate(null); }} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${tripType === "round-trip" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"}`}>Round Trip</button>
            <button type="button" onClick={() => { setTripType("one-way"); setReturnDate(null); }} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${tripType === "one-way" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"}`}>One Way</button>
            <button type="button" onClick={() => setTripType("multi-city")} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${tripType === "multi-city" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"}`}>Multi-City</button>
          </div>

          <div className="transition-all duration-500 relative">
            
            {tripType !== "multi-city" ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
                
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">From</label>
                  <input type="text" placeholder="Lahore (LHE)" className="bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">To</label>
                  <input type="text" placeholder="Where to?" className="bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                </div>

                {/* Calendar Input Wrapper */}
                <div className="flex flex-col relative">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    {tripType === "one-way" ? "Departure" : "Departure - Return"}
                  </label>
                  <input 
                    type="text" 
                    readOnly
                    placeholder={tripType === "one-way" ? "Select Date" : "Add Dates"}
                    value={departureDate ? `${formatDate(departureDate)}${tripType === 'round-trip' ? (returnDate ? ` - ${formatDate(returnDate)}` : ' - Return') : ''}` : ''}
                    onClick={() => { setActiveCalendar('main'); setShowPassengerPopup(false); }}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" 
                  />

                  {activeCalendar === 'main' && (
                    <div 
                      className={`absolute top-full left-0 md:left-auto md:right-0 mt-3 bg-[#0a1120]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 z-50 cursor-default ${tripType === 'round-trip' ? 'w-80 md:w-[600px]' : 'w-80'}`}
                      onClick={(e) => e.stopPropagation()} // FIX: Stop clicks from closing popup
                    >
                      <div className="flex justify-between items-center mb-4">
                        <button type="button" onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition text-blue-400"><FaChevronLeft size={14} /></button>
                        <button type="button" onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition text-blue-400"><FaChevronRight size={14} /></button>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                        {renderMonth(0)}
                        {/* FIX: Second month only shows if it's Round Trip */}
                        {tripType === "round-trip" && (
                          <div className="hidden md:block">{renderMonth(1)}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Passenger Input Wrapper */}
                <div className="flex flex-col relative">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">Passengers & Class</label>
                  <input 
                    type="text" 
                    readOnly
                    value={`${totalPassengers} Passenger${totalPassengers > 1 ? 's' : ''}, ${flightClass}`}
                    onClick={() => { setShowPassengerPopup(true); setActiveCalendar(null); }}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" 
                  />
                  {showPassengerPopup && passengerPopupContent}
                </div>

              </div>
            ) : (
              
              /* MULTI-CITY LAYOUT */
              <div className="flex flex-col gap-4">
                {multiFlights.map((flight, index) => (
                  <div key={flight.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end bg-white/5 p-4 rounded-2xl border border-white/5 relative">
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                      {index + 1}
                    </div>
                    
                    <div className="flex flex-col pl-3 md:pl-0">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">From</label>
                      <input type="text" placeholder="City or Airport" className="bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                    </div>
                    
                    <div className="flex flex-col pl-3 md:pl-0">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">To</label>
                      <input type="text" placeholder="Where to?" className="bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                    </div>
                    
                    <div className="flex flex-col relative pl-3 md:pl-0">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">Departure</label>
                      <input 
                        type="text" 
                        readOnly
                        placeholder="Select Date"
                        value={formatDate(flight.date)}
                        onClick={() => { setActiveCalendar(flight.id); setShowPassengerPopup(false); }}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" 
                      />
                      
                      {activeCalendar === flight.id && (
                        <div 
                          className="absolute top-full left-0 mt-3 w-80 bg-[#0a1120]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-5 z-50 cursor-default"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <button type="button" onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition text-blue-400"><FaChevronLeft size={12} /></button>
                            <button type="button" onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition text-blue-400"><FaChevronRight size={12} /></button>
                          </div>
                          {renderMonth(0, flight.id)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end pb-1 pr-1 md:pr-0 pl-3 md:pl-0">
                      <button type="button" onClick={() => removeFlight(flight.id)} disabled={multiFlights.length <= 2} className={`p-4 rounded-xl transition-all ${multiFlights.length > 2 ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}><FaTimes /></button>
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mt-4 pt-4 border-t border-white/10">
                  <button type="button" onClick={addFlight} disabled={multiFlights.length >= 6} className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed">
                    <FaPlus size={12} /> Add another flight
                  </button>
                  
                  {/* FIX: Passenger popup now properly shows in Multi-City */}
                  <div className="flex flex-col relative w-full lg:w-1/3">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">Passengers & Class</label>
                    <input 
                      type="text" 
                      readOnly
                      value={`${totalPassengers} Passenger${totalPassengers > 1 ? 's' : ''}, ${flightClass}`}
                      onClick={() => { setShowPassengerPopup(true); setActiveCalendar(null); }}
                      className="bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" 
                    />
                    {showPassengerPopup && passengerPopupContent}
                  </div>
                </div>
              </div>
            )}
            
          </div>

          <div className="mt-8 flex justify-center lg:justify-end">
            <button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-12 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] tracking-wide transform hover:-translate-y-1">
              Search Flights
            </button>
          </div>

        </div>
      </section>
      
    </main>
  );
}