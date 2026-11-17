import Link from "next/link";

export default function Hero() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center pointer-events-none px-6 flex flex-col items-center mt-6 md:mt-0">
      
      {/* Main Heading */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase drop-shadow-2xl mb-4 md:mb-6">
        Journey Beyond <br className="hidden md:block" /> Borders
      </h2>
      
      {/* Subheading */}
      <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 md:mb-10 drop-shadow-md font-medium leading-relaxed px-2">
        Your trusted partner for worldwide air ticketing, exclusive international tours, and expert visa assistance.
      </p>
      
      {/* Buttons Container */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-5 w-full max-w-5xl pointer-events-auto px-4 sm:px-0">
        
        {/* 1. Book a Flight (Now a Link pointing to /air-ticketing) */}
        <Link href="/air-ticketing" className="relative flex justify-center items-center w-full sm:w-auto md:w-64 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 text-base rounded-full font-bold transition-all duration-300 shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] ring-2 ring-blue-500/30 tracking-wide transform hover:-translate-y-1 cursor-pointer z-10">
          Book a Flight
        </Link>

        {/* 2. Get Your Visa */}
        <button className="relative w-full sm:w-auto md:w-44 bg-gradient-to-r from-amber-400 to-orange-400 md:from-white/10 md:to-white/5 hover:from-amber-400 hover:to-orange-400 border border-transparent md:border-white/20 hover:border-transparent backdrop-blur-md group py-3 text-base rounded-full font-bold transition-all duration-300 shadow-[0_0_40px_rgba(245,158,11,0.6)] md:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] ring-2 ring-amber-500/50 md:ring-white/10 hover:ring-amber-500/50 tracking-wide transform hover:-translate-y-1 cursor-pointer z-10">
          <span className="text-black md:text-transparent bg-none md:bg-clip-text md:bg-gradient-to-r md:from-amber-300 md:to-orange-400 opacity-100 md:opacity-75 group-hover:opacity-100 group-hover:text-black group-hover:bg-none transition-all duration-300">
            Get Your Visa
          </span>
        </button>

        {/* 3. Explore Tours */}
        <button className="relative w-full sm:w-auto md:w-44 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 backdrop-blur-md text-white py-3 text-base rounded-full font-bold transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] ring-2 ring-white/10 tracking-wide transform hover:-translate-y-1 cursor-pointer z-10">
          Explore Tours
        </button>
        
      </div>

    </div>
  );
}