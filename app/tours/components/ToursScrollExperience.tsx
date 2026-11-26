"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ALL_TOURS } from "../data";
import { TourPackage } from "../types";

const TOTAL_FRAMES = 446;
const FRAME_FOLDER = "/Tours";

function getFramePath(frameNumber: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameNumber)));
  return `${FRAME_FOLDER}/frame${clamped}.jpg`;
}

function getActiveTourForFrame(frame: number): TourPackage | null {
  for (const tour of ALL_TOURS) {
    if (frame >= tour.frameStart && frame <= tour.frameEnd) {
      return tour;
    }
  }
  return null;
}

export default function ToursScrollExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);

  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    let animationFrameId = 0;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const drawFrame = (frameNum: number) => {
      const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameNum) - 1));
      let img = imagesRef.current[idx];

      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = imagesRef.current[idx - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            img = prev;
            break;
          }
          const next = imagesRef.current[idx + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            img = next;
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (
        canvas.width !== Math.round(displayWidth * dpr) ||
        canvas.height !== Math.round(displayHeight * dpr)
      ) {
        canvas.width = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = displayWidth / displayHeight;

      let drawWidth = displayWidth;
      let drawHeight = displayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = displayWidth / imgRatio;
        offsetY = (displayHeight - drawHeight) / 2;
      } else {
        drawWidth = displayHeight * imgRatio;
        offsetX = (displayWidth - drawWidth) / 2;
      }

      ctx.fillStyle = "#040916";
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    };

    const loadImageAt = (zeroIdx: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[zeroIdx]) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.src = getFramePath(zeroIdx + 1);
        img.onload = () => {
          if (!isMounted) return;
          imagesRef.current[zeroIdx] = img;
          setLoadedCount((prev) => prev + 1);
          if (zeroIdx === 0 && lastDrawnFrameRef.current === -1) {
            lastDrawnFrameRef.current = 1;
            drawFrame(1);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    const preloadFrames = async () => {
      // Load initial frames immediately
      const firstBatch = [];
      for (let i = 0; i < Math.min(20, TOTAL_FRAMES); i++) {
        firstBatch.push(loadImageAt(i));
      }
      await Promise.all(firstBatch);

      // Load remaining frames in smooth batches
      const batchSize = 25;
      for (let start = 20; start < TOTAL_FRAMES; start += batchSize) {
        if (!isMounted) break;
        const batch = [];
        for (let i = start; i < Math.min(start + batchSize, TOTAL_FRAMES); i++) {
          batch.push(loadImageAt(i));
        }
        await Promise.all(batch);
      }
    };

    preloadFrames();

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;

      if (scrollable <= 0) {
        targetFrameRef.current = 1;
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
    };

    const handleResize = () => drawFrame(currentFrameRef.current);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    const loop = () => {
      if (!isMounted) return;
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.2;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const rounded = Math.round(currentFrameRef.current);
      if (rounded !== lastDrawnFrameRef.current) {
        lastDrawnFrameRef.current = rounded;
        drawFrame(rounded);
        setCurrentFrame(rounded);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const jumpToFrame = (frameNumber: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollable = rect.height - window.innerHeight;
    const ratio = (frameNumber - 1) / (TOTAL_FRAMES - 1);
    window.scrollTo({
      top: containerTop + ratio * scrollable,
      behavior: "smooth",
    });
  };

  const activeTour = getActiveTourForFrame(currentFrame);
  const progressPercent = Math.round(
    ((currentFrame - 1) / (TOTAL_FRAMES - 1)) * 100
  );
  const bufferPercent = Math.min(
    100,
    Math.round((loadedCount / TOTAL_FRAMES) * 100)
  );

  return (
    <section
      ref={containerRef}
      aria-label="Airfare Masters World Tours Interactive Showcase"
      className="relative w-full h-[680vh] bg-[#040916]"
    >
      {/* Sticky Full-Screen Frame Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full object-cover" />

        {/* Readability Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#040916]/85 via-[#040916]/45 to-[#040916]/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040916]/90 via-transparent to-[#040916]/55"
        />

        {/* Active Tour Overlay Card */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center pt-16 pb-24">
          {ALL_TOURS.map((tour) => {
            const isVisible =
              currentFrame >= tour.frameStart && currentFrame <= tour.frameEnd;

            return (
              <div
                key={tour.slug}
                className={`w-full max-w-2xl transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0 pointer-events-auto relative"
                    : "opacity-0 translate-y-6 pointer-events-none absolute"
                }`}
              >
                <div className="rounded-3xl bg-[#071224]/75 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.65)] text-white">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[11px] font-bold tracking-wider uppercase">
                      {tour.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                      {tour.location} &bull; {tour.durationLabel}
                    </span>
                  </div>

                  {/* Tour Heading */}
                  <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {tour.cardTitle}
                  </h2>

                  {tour.subtitle && (
                    <p className="mt-2 text-xs sm:text-sm font-semibold text-amber-300">
                      {tour.subtitle}
                    </p>
                  )}

                  {/* Package Includes List */}
                  <div className="mt-5">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2.5">
                      Package Includes
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tour.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-200"
                        >
                          <span className="text-sky-400 font-bold mt-0.5">
                            &#10003;
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Price & Details Button */}
                  <div className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                        Starting Package Price
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">
                        {tour.startingPrice}
                      </div>
                    </div>

                    <Link
                      href={`/tours/${tour.slug}`}
                      className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-[0_10px_28px_rgba(14,165,233,0.4)] hover:shadow-[0_14px_34px_rgba(14,165,233,0.6)] transition-all"
                    >
                      <span>View Details</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scenic Transition Bridge Between Frame Ranges */}
          {!activeTour && (
            <div className="max-w-lg rounded-3xl bg-[#071224]/65 backdrop-blur-md border border-white/10 p-6 text-white">
              <div className="text-[11px] font-bold tracking-widest uppercase text-sky-400">
                WORLD TOURS BY AIRFARE MASTERS
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Keep Scrolling to Explore Next Destination
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Scroll down to discover our curated international group &amp;
                family packages, or select a destination below.
              </p>
            </div>
          )}
        </div>

        {/* Bottom HUD: Destination Quick Jump Tabs + Frame Progress */}
        <div className="absolute bottom-5 inset-x-0 px-6 sm:px-10 lg:px-14 z-20">
          <div className="max-w-7xl mx-auto rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Quick Destination Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {ALL_TOURS.map((tour, index) => {
                const isCurrent = activeTour?.slug === tour.slug;
                return (
                  <button
                    key={tour.slug}
                    type="button"
                    onClick={() => jumpToFrame(tour.frameStart + 5)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                        : "bg-white/[0.06] hover:bg-white/[0.14] text-slate-200"
                    }`}
                  >
                    {index + 1}. {tour.location}
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] font-mono text-sky-300">
                Frame {String(currentFrame).padStart(3, "0")} / {TOTAL_FRAMES}
              </span>
              <div className="w-28 sm:w-36 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {bufferPercent < 100 && (
                <span className="hidden sm:inline text-[10px] text-slate-400">
                  {bufferPercent}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}