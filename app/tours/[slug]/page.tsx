'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import * as toursModule from '../data';
import TourDetailView from '../components/TourDetailView';

type TourItem = React.ComponentProps<typeof TourDetailView>['tour'];

function getAllTours(): TourItem[] {
  const collected: TourItem[] = [];
  const exportedValues = Object.values(toursModule);

  for (const value of exportedValues) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === 'object') {
          collected.push(item as TourItem);
        }
      }
    }
  }

  return collected;
}

function findTourBySlug(slug: string): TourItem | undefined {
  const allTours = getAllTours();
  if (!slug) return undefined;

  const normalized = slug.toLowerCase().trim();

  // 1. Exact slug or id match
  const exactMatch = allTours.find((item) => {
    const record = item as unknown as Record<string, unknown>;
    const itemSlug = String(record.slug ?? '').toLowerCase();
    const itemId = String(record.id ?? '').toLowerCase();
    return itemSlug === normalized || itemId === normalized;
  });
  if (exactMatch) return exactMatch;

  // 2. Partial slug, title, or destination match
  return allTours.find((item) => {
    const record = item as unknown as Record<string, unknown>;
    const itemSlug = String(record.slug ?? '').toLowerCase();
    const itemTitle = String(record.title ?? '').toLowerCase();
    const itemDestination = String(record.destination ?? '').toLowerCase();

    return (
      (itemSlug && (itemSlug.includes(normalized) || normalized.includes(itemSlug))) ||
      (itemTitle && itemTitle.includes(normalized)) ||
      (itemDestination && itemDestination.includes(normalized))
    );
  });
}

function SpecificTourContent() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug =
    typeof rawSlug === 'string'
      ? rawSlug
      : Array.isArray(rawSlug)
        ? rawSlug[0]
        : '';

  const tour = findTourBySlug(slug);

  if (!tour) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Tour Package Not Found
        </h1>
        <p className="text-slate-300 max-w-md mb-6">
          The requested tour package could not be found. Please explore our available world tours.
        </p>
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all"
        >
          Back to World Tours
        </Link>
      </div>
    );
  }

  return <TourDetailView tour={tour} />;
}

export default function SpecificTourPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent mb-3" />
          <p className="text-sm tracking-widest uppercase text-slate-300">
            Loading Tour Details...
          </p>
        </div>
      }
    >
      <SpecificTourContent />
    </Suspense>
  );
}