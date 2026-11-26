"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getTourBySlug } from "../data";
import TourDetailView from "../components/TourDetailView";

export default function SpecificTourPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const tour = getTourBySlug(slug);

  return (
    <main className="min-h-screen bg-[#040916] text-white">
      <Navbar />
      {tour ? (
        <TourDetailView tour={tour} />
      ) : (
        <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center pt-24">
          <h1 className="text-3xl font-extrabold text-white">
            Tour Package Not Found
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            The requested tour package does not exist or may have been updated.
          </p>
          <Link
            href="/tours"
            className="mt-6 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
          >
            Explore All World Tours &rarr;
          </Link>
        </div>
      )}
    </main>
  );
}