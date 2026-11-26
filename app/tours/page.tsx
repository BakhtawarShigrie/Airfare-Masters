"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import ToursScrollExperience from "./components/ToursScrollExperience";

export default function WorldToursPage() {
  return (
    <main className="min-h-screen bg-[#040916] text-white">
      <Navbar />
      <ToursScrollExperience />
    </main>
  );
}