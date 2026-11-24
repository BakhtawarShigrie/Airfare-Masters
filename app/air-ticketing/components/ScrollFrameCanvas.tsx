"use client";

import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 300;
const FRAME_FOLDER = "/Ticketing";

function getFramePath(index: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index + 1));
  const padded = String(clamped).padStart(3, "0");
  return `${FRAME_FOLDER}/ezgif-frame-${padded}.jpg`;
}

interface ScrollFrameCanvasProps {
  onBookNowClick?: () => void;
}

export default function ScrollFrameCanvas({
  onBookNowClick,
}: ScrollFrameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  const [activeFrameDisplay, setActiveFrameDisplay] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    let animationFrameId = 0;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const drawFrame = (frameIndex: number) => {
      const idx = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex))
      );
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

    const loadImageAt = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.src = getFramePath(index);
        img.onload = () => {
          if (!isMounted) return;
          imagesRef.current[index] = img;
          setLoadedCount((prev) => prev + 1);
          if (index === 0 && lastDrawnFrameRef.current === -1) {
            lastDrawnFrameRef.current = 0;
            drawFrame(0);
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    };

    const preloadAllFrames = async () => {
      const initialBatch = [];
      for (let i = 0; i < Math.min(15, TOTAL_FRAMES); i++) {
        initialBatch.push(loadImageAt(i));
      }
      await Promise.all(initialBatch);

      const batchSize = 20;
      for (let start = 15; start < TOTAL_FRAMES; start += batchSize) {
        if (!isMounted) break;
        const batch = [];
        for (
          let i = start;
          i < Math.min(start + batchSize, TOTAL_FRAMES);
          i++
        ) {
          batch.push(loadImageAt(i));
        }
        await Promise.all(batch);
      }
    };

    preloadAllFrames();

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) {
        targetFrameRef.current = 0;
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
      setScrollProgress(progress);
    };

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    const renderLoop = () => {
      if (!isMounted) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.18;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const roundedFrame = Math.round(currentFrameRef.current);
      if (roundedFrame !== lastDrawnFrameRef.current) {
        lastDrawnFrameRef.current = roundedFrame;
        drawFrame(roundedFrame);
        setActiveFrameDisplay(roundedFrame + 1);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isPreloading = loadedCount < TOTAL_FRAMES;
  const preloadPercent = Math.min(
    100,
    Math.round((loadedCount / TOTAL_FRAMES) * 100)
  );

  return (
    <section
      ref={containerRef}
      aria-label="Airfare Masters Interactive Flight Experience"
      className="relative w-full h-[460vh] bg-[#040916]"
    >
      {/* Sticky Viewport Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-cover"
        />

        {/* Subtle Top & Bottom Vignette for Navbar & Text Readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040916]/60 via-transparent to-[#040916]/90"
        />

        {/* Stage 1 Overlay: Positioned at Bottom Left so Center Frames Stay Clear */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-24 sm:bottom-28 px-6 sm:px-10 lg:px-14 transition-all duration-500 ${
            scrollProgress < 0.32
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-sky-400/30 backdrop-blur-md text-sky-300 text-xs font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Worldwide Air Ticketing Desk</span>
              </div>
              <h1 className="mt-3.5 text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
                Seamless Flights,{" "}
                <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-amber-300 bg-clip-text text-transparent">
                  Unbeatable Fares
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                Scroll down to explore your journey &mdash; scroll up anytime
                to rewind. Book domestic &amp; international tickets with
                instant confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Stage 2 Overlay (Frames 96 - 205) */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-24 sm:bottom-28 px-6 sm:px-10 lg:px-14 transition-all duration-500 ${
            scrollProgress >= 0.34 && scrollProgress < 0.68
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-7xl mx-auto flex justify-start">
            <div className="max-w-md rounded-3xl bg-slate-950/65 backdrop-blur-md border border-white/15 p-6 text-white shadow-2xl">
              <div className="text-[11px] font-bold tracking-widest uppercase text-amber-300">
                150+ GLOBAL AIRLINES
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1.5">
                Economy, Business &amp; First Class
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Direct &amp; connecting flights from Lahore, Islamabad, and
                Karachi to UAE, Saudi Arabia, UK, Europe, USA, Canada &amp;
                Far East.
              </p>
            </div>
          </div>
        </div>

        {/* Stage 3 Overlay (Frames 206 - 300) */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-24 sm:bottom-28 px-6 sm:px-10 lg:px-14 transition-all duration-500 ${
            scrollProgress >= 0.7
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-lg">
              <div className="text-[11px] font-bold tracking-widest uppercase text-sky-300">
                READY FOR TAKEOFF
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                Search &amp; Lock Your Best Airfare Below
              </h2>
            </div>

            {onBookNowClick && (
              <button
                type="button"
                onClick={onBookNowClick}
                className="pointer-events-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all cursor-pointer"
              >
                <span>Search Flights</span>
                <span aria-hidden="true">&darr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom HUD Bar: Scroll Scrubbing Progress + Quick Jump CTA */}
        <div className="absolute bottom-5 inset-x-0 px-6 sm:px-10 lg:px-14 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-mono text-sky-300 shrink-0">
                {String(activeFrameDisplay).padStart(3, "0")} / {TOTAL_FRAMES}
              </span>
              <div className="w-24 sm:w-44 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-75"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="hidden md:inline text-[11px] text-slate-400">
                {isPreloading
                  ? `Buffering frames (${preloadPercent}%)...`
                  : "Scroll down to advance • Scroll up to rewind"}
              </span>
            </div>

            {onBookNowClick && (
              <button
                type="button"
                onClick={onBookNowClick}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Book Ticket</span>
                <span aria-hidden="true">&darr;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}