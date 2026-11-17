export default function Hero() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center pointer-events-none px-6 flex flex-col items-center mt-6 md:mt-0">
      
      {/* Main Heading with Premium Gradient Effect */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase drop-shadow-2xl mb-4 md:mb-6">
        Journey Beyond <br className="hidden md:block" /> Borders
      </h2>
      
      {/* Subheading with your core services */}
      <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 md:mb-10 drop-shadow-md font-medium leading-relaxed px-2">
        Your trusted partner for worldwide air ticketing, exclusive international tours, and expert visa assistance.
      </p>
      
      {/* Buttons (Full width on mobile, side-by-side on desktop) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pointer-events-auto px-4 sm:px-0">
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] tracking-wide">
          Book a Flight
        </button>
        <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-medium transition-all tracking-wide">
          Explore Tours
        </button>
      </div>

    </div>
  );
}