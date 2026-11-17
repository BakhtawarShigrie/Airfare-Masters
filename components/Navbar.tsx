"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-20 pointer-events-auto">
      {/* Top Bar */}
      <div className="hidden lg:flex justify-between items-center px-6 lg:px-12 py-2 border-b border-white/10 text-xs text-gray-300 bg-black/10 backdrop-blur-[2px] relative">
        <div className="flex items-center gap-6 z-10">
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition">
            <FaPhoneAlt />
            <span>+92 308 4813513</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition">
            <FaEnvelope />
            <span>info.aifaremasters@gmail.com</span>
          </div>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold tracking-widest uppercase text-white w-max">
          WE CONNECT YOU WITH THE WORLD
        </div>

        <div className="flex items-center gap-5 z-10">
          <Link href="#" className="bg-white text-black p-1.5 rounded-full hover:bg-gray-300 transition">
            <FaFacebookF size={12} />
          </Link>
          <Link href="#" className="bg-white text-black p-1.5 rounded-full hover:bg-gray-300 transition">
            <FaInstagram size={12} />
          </Link>
          <Link href="#" className="bg-white text-black p-1.5 rounded-full hover:bg-gray-300 transition">
            <FaTiktok size={12} />
          </Link>
          <Link href="#" className="bg-white text-black p-1.5 rounded-full hover:bg-gray-300 transition">
            <FaYoutube size={12} />
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="relative flex justify-between items-center px-6 lg:px-12 py-4 bg-gradient-to-b from-black/50 to-transparent z-30">
        <Link href="/">
          <div className="relative w-[180px] h-[45px] md:w-[200px] md:h-[50px]">
            <Image 
              src="/logo-white.png" 
              alt="Airfare Masters Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <Link href="#" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">Air Ticketing</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">World Tours</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">Hotels</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">Visa Services</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link>
        </div>

        <button 
          className="lg:hidden text-white p-2 focus:outline-none hover:text-blue-400 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`lg:hidden absolute left-4 right-4 mt-2 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl transition-all duration-500 ease-in-out z-20 ${
          isMobileMenuOpen 
            ? "max-h-[500px] opacity-100 py-6 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]" 
            : "max-h-0 opacity-0 py-0 border border-transparent shadow-none"
        }`}
      >
        <div className="flex flex-col items-center gap-5 text-sm font-medium">
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">Home</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">Air Ticketing</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">World Tours</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">Hotels</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">Visa Services</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">Contact</Link>
          <Link href="#" className="hover:text-blue-400 transition-colors w-full text-center py-2">About Us</Link>
        </div>
      </div>
    </header>
  );
}