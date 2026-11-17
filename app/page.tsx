"use client";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

// Globe ko sirf Client Side par load karna lazmi hai
const Globe = dynamic(() => import("../components/Globe"), { ssr: false });

export default function Home() {
  return (
    // Main tag se 'overflow-hidden' aur 'h-screen' nikal kar 'min-h-screen' kar diya hai
    <main className="relative w-full min-h-screen bg-gradient-to-br from-[#111827] via-[#050b14] to-[#1e1b4b] text-white">
      
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section (Peha Hissa jismein Globe aur Text hai) */}
      <section className="relative w-full h-screen overflow-hidden">
        <Hero />
        <div className="absolute inset-0 z-0">
          <Globe />
        </div>
      </section>

      {/* Yahan aapke naye sections aayenge jese (Destinations, About Us wagera) */}
      
    </main>
  );
}