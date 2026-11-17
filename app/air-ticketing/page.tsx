"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function AirTicketing() {
  const [tripType, setTripType] = useState("round-trip");
  
  // Multi-city ke liye default 2 flights ki state
  const [multiFlights, setMultiFlights] = useState([{ id: 1 }, { id: 2 }]);

  const addFlight = () => {
    if (multiFlights.length < 6) { // Max 6 flights allow ki hain
      setMultiFlights([...multiFlights, { id: Date.now() }]);
    }
  };

  const removeFlight = (id: number) => {
    if (multiFlights.length > 2) { // Kam az kam 2 flights rehni chahiye
      setMultiFlights(multiFlights.filter(flight => flight.id !== id));
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-[#111827] via-[#050b14] to-[#1e1b4b] text-white">
      
      <Navbar />

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-lg mb-4">
            Search Flights
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Find the best deals on flights worldwide. Enter your destination and let us take you there.
          </p>
        </div>

        {/* Flight Search Widget */}
        <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500">
          
          {/* Trip Type Buttons (Workable State) */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button 
              onClick={() => setTripType("round-trip")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${tripType === "round-trip" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"}`}
            >
              Round Trip
            </button>
            <button 
              onClick={() => setTripType("one-way")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${tripType === "one-way" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"}`}
            >
              One Way
            </button>
            <button 
              onClick={() => setTripType("multi-city")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${tripType === "multi-city" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"}`}
            >
              Multi-City
            </button>
          </div>

          {/* Dynamic Fields Area */}
          <div className="transition-all duration-500">
            
            {/* ROUND TRIP & ONE WAY LAYOUT */}
            {tripType !== "multi-city" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* From */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">From</label>
                  <input type="text" placeholder="Lahore (LHE)" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                </div>
                {/* To */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">To</label>
                  <input type="text" placeholder="Where to?" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                </div>
                {/* Dates (Changes dynamically based on One Way or Round Trip) */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    {tripType === "one-way" ? "Departure" : "Departure - Return"}
                  </label>
                  <input type="text" placeholder={tripType === "one-way" ? "Select Date" : "Add Dates"} className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                </div>
                {/* Passengers */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">Passengers & Class</label>
                  <input type="text" placeholder="1 Adult, Economy" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
                </div>
              </div>
            ) : (
              
              /* MULTI-CITY LAYOUT */
              <div className="flex flex-col gap-5">
                {multiFlights.map((flight, index) => (
                  <div key={flight.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-5 items-end bg-white/5 p-4 rounded-2xl border border-white/5 relative group">
                    <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                      {index + 1}
                    </div>
                    {/* From */}
                    <div className="flex flex-col pl-2 md:pl-0">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">From</label>
                      <input type="text" placeholder="City or Airport" className="bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                    </div>
                    {/* To */}
                    <div className="flex flex-col pl-2 md:pl-0">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">To</label>
                      <input type="text" placeholder="Where to?" className="bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                    </div>
                    {/* Date */}
                    <div className="flex flex-col pl-2 md:pl-0">
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">Departure</label>
                      <input type="text" placeholder="Select Date" className="bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                    </div>
                    {/* Remove Button (Only if more than 2 flights) */}
                    <div className="flex justify-end pb-1 pr-2 md:pr-0">
                      <button 
                        onClick={() => removeFlight(flight.id)}
                        disabled={multiFlights.length <= 2}
                        className={`p-3 rounded-xl transition-all ${multiFlights.length > 2 ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        title="Remove Flight"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Multi-City Bottom Controls (Add Flight & Passengers) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mt-2 pt-4 border-t border-white/10">
                  <button 
                    onClick={addFlight}
                    disabled={multiFlights.length >= 6}
                    className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
                  >
                    <FaPlus size={12} /> Add another flight
                  </button>
                  
                  <div className="flex flex-col w-full md:w-1/3">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 ml-1">Passengers & Class</label>
                    <input type="text" placeholder="1 Adult, Economy" className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-full" />
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Search Button */}
          <div className="mt-8 flex justify-center lg:justify-end">
            <button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1">
              Search Flights
            </button>
          </div>

        </div>
      </section>
      
    </main>
  );
}