"use client";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

// Globe ko sirf Client Side par load karna lazmi hai
const Globe = dynamic(() => import("../components/Globe"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#111827] via-[#050b14] to-[#1e1b4b] text-white">
      
      {/* 1. Navbar Component */}
      <Navbar />

      {/* 2. Hero Component */}
      <Hero />

      {/* 3. 3D Globe Background */}
      <div className="absolute inset-0 z-0">
        <Globe />
      </div>
      
    </main>
  );
}