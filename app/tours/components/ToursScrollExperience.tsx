'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface TourSection {
  id: string;
  navLabel: string;
  packageTitle: string;
  location: string;
  duration: string;
  slug: string;
  startFrame: number;
  endFrame: number;
  jumpFrame: number;
  includes: string[];
}

const TOTAL_FRAMES = 446;

const TOUR_SECTIONS: TourSection[] = [
  {
    id: 'skardu',
    navLabel: 'SKARDU',
    packageTitle: 'SKARDU 5 NIGHT 6 DAYS TOUR PACKAGE',
    location: 'SKARDU BALTISTAN',
    duration: '6 Days',
    slug: 'skardu',
    startFrame: 1,
    endFrame: 95,
    jumpFrame: 1,
    includes: [
      'Return Air Tickets (Lahore - Skardu - Lahore)',
      'Hotel Accommodation',
      'Private Transportation',
      'Daily Breakfast & Dinner',
      'Sightseeing as per Itinerary',
      'Airport Transfers',
    ],
  },
  {
    id: 'japan',
    navLabel: 'JAPAN',
    packageTitle: 'JAPAN TOKYO & OSAKA TOUR PACKAGE',
    location: 'TOKYO & OSAKA, JAPAN',
    duration: '7 Days',
    slug: 'japan',
    startFrame: 96,
    endFrame: 195,
    jumpFrame: 135,
    includes: [
      'Return International Air Tickets',
      '4-Star Hotel Accommodation',
      'Bullet Train (Shinkansen) & Transfers',
      'Daily Breakfast',
      'Guided Sightseeing (Tokyo, Mt. Fuji & Osaka)',
      'Japan Visa Assistance & Airport Transfers',
    ],
  },
  {
    id: 'thailand',
    navLabel: 'THAILAND',
    packageTitle: 'THAILAND BANGKOK & PATTAYA TOUR PACKAGE',
    location: 'BANGKOK & PATTAYA, THAILAND',
    duration: '6 Days',
    slug: 'thailand',
    startFrame: 196,
    endFrame: 285,
    jumpFrame: 250,
    includes: [
      'Return International Air Tickets',
      'Hotel Accommodation',
      'Coral Island Tour with Lunch',
      'Daily Breakfast',
      'City Sightseeing & Private Transfers',
      'Thailand Visa Assistance & Airport Transfers',
    ],
  },
  {
    id: 'uzbekistan',
    navLabel: 'UZBEKISTAN',
    packageTitle: 'UZBEKISTAN TASHKENT & SAMARKAND TOUR PACKAGE',
    location: 'TASHKENT & SAMARKAND, UZBEKISTAN',
    duration: '4 & 8 Days',
    slug: 'uzbekistan',
    startFrame: 286,
    endFrame: 375,
    jumpFrame: 320,
    includes: [
      'Return Direct Air Tickets (Lahore - Tashkent - Lahore)',
      'Hotel Accommodation',
      'Afrosiyob High-Speed Bullet Train',
      'Daily Breakfast',
      'Chimgan Mountains & Samarkand Sightseeing',
      'Uzbekistan E-Visa & Airport Transfers',
    ],
  },
  {
    id: 'china',
    navLabel: 'CHINA',
    packageTitle: 'CHINA BEIJING & SHANGHAI TOUR PACKAGE',
    location: 'BEIJING & SHANGHAI, CHINA',
    duration: '7 Days',
    slug: 'china',
    startFrame: 376,
    endFrame: 446,
    jumpFrame: 415,
    includes: [
      'Return International Air Tickets',
      '4-Star Hotel Accommodation',
      'High-Speed Rail & Private Transportation',
      'Daily Breakfast',
      'Great Wall & Forbidden City Sightseeing',
      'China Visa Assistance & Airport Transfers',
    ],
  },
];

function getSectionVisibility(frame: number, section: TourSection): number {
  const transitionFrames = 12;
  const { startFrame, endFrame } = section;

  // Keep the first section (Skardu) directly visible at Frame 1 with zero initial fade/blur delay
  if (startFrame === 1) {
    if (frame > endFrame + 2) {
      return 0;
    }
    if (frame > endFrame - transitionFrames) {
      const progress = (endFrame - frame) / transitionFrames;
      return Math.max(0, Math.min(1, progress));
    }
    return 1;
  }

  if (frame < startFrame - 2 || frame > endFrame + 2) {
    return 0;
  }

  // Smooth fade & de-blur in at the start of section frames
  if (frame < startFrame + transitionFrames) {
    const progress = (frame - startFrame) / transitionFrames;
    return Math.max(0, Math.min(1, progress));
  }

  // Smooth fade & blur out at the end of section frames
  if (frame > endFrame - transitionFrames) {
    const progress = (endFrame - frame) / transitionFrames;
    return Math.max(0, Math.min(1, progress));
  }

  return 1;
}

export default function ToursScrollExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  );
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const lastRenderedFrameRef = useRef<number>(0);

  const [smoothFrame, setSmoothFrame] = useState<number>(1);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  // Keep Navbar in its default top-of-page state even while scrolling on /tours
  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    const hadOwnScrollY = Object.prototype.hasOwnProperty.call(window, 'scrollY');
    const hadOwnPageYOffset = Object.prototype.hasOwnProperty.call(
      window,
      'pageYOffset'
    );
    const origScrollYDesc = Object.getOwnPropertyDescriptor(window, 'scrollY');
    const origPageYOffsetDesc = Object.getOwnPropertyDescriptor(
      window,
      'pageYOffset'
    );

    try {
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        get: () => 0,
      });
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        get: () => 0,
      });
    } catch {
      // Ignore if environment disallows redefining scrollY
    }

    return () => {
      try {
        if (hadOwnScrollY && origScrollYDesc) {
          Object.defineProperty(window, 'scrollY', origScrollYDesc);
        } else {
          delete win.scrollY;
        }

        if (hadOwnPageYOffset && origPageYOffsetDesc) {
          Object.defineProperty(window, 'pageYOffset', origPageYOffsetDesc);
        } else {
          delete win.pageYOffset;
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  // Draw frame onto canvas with cover aspect ratio
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
    let img = imagesRef.current[clampedIndex];

    // Fallback to nearest loaded frame if current frame is still decoding
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset <= 25; offset++) {
        const prev = imagesRef.current[clampedIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[clampedIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (
      canvas.width !== Math.floor(displayWidth * dpr) ||
      canvas.height !== Math.floor(displayHeight * dpr)
    ) {
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = displayWidth / displayHeight;

    let renderWidth = displayWidth;
    let renderHeight = displayHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderWidth = displayWidth;
      renderHeight = displayWidth / imgRatio;
      offsetY = (displayHeight - renderHeight) / 2;
    } else {
      renderHeight = displayHeight;
      renderWidth = displayHeight * imgRatio;
      offsetX = (displayWidth - renderWidth) / 2;
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
    ctx.restore();
  }, []);

  // Preload frames progressively (first batch immediately, rest in background)
  useEffect(() => {
    let isCancelled = false;

    const loadSingleFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = `/Tours/frame${index}.jpg`;
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[index] = img;
            if (index === 1) {
              setInitialLoaded(true);
              drawFrame(1);
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    const preloadAll = async () => {
      const priorityBatch: Promise<void>[] = [];
      for (let i = 1; i <= 35; i++) {
        priorityBatch.push(loadSingleFrame(i));
      }
      await Promise.all(priorityBatch);
      if (!isCancelled) {
        setInitialLoaded(true);
        drawFrame(currentFrameRef.current);
      }

      const chunkSize = 20;
      for (let start = 36; start <= TOTAL_FRAMES; start += chunkSize) {
        if (isCancelled) break;
        const batch: Promise<void>[] = [];
        for (let i = start; i < start + chunkSize && i <= TOTAL_FRAMES; i++) {
          batch.push(loadSingleFrame(i));
        }
        await Promise.all(batch);
      }
    };

    preloadAll();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // Listen to scroll and resize events
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const scrolled = Math.max(0, Math.min(scrollableDistance, -rect.top));
      const progress = scrolled / scrollableDistance;
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
    };

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawFrame]);

  // Slow, smooth RAF interpolation loop for cinematic frame playback
  useEffect(() => {
    let animationId: number;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.015) {
        currentFrameRef.current += diff * 0.055;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const rounded = Math.round(currentFrameRef.current);
      if (rounded !== lastRenderedFrameRef.current) {
        lastRenderedFrameRef.current = rounded;
        drawFrame(rounded);
      }

      setSmoothFrame((prev) =>
        Math.abs(prev - currentFrameRef.current) > 0.06
          ? currentFrameRef.current
          : prev
      );

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [drawFrame]);

  // Scroll smoothly to the exact target frame when a destination is clicked
  const handleJumpToSection = (section: TourSection) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const currentScroll =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    const containerTop = container.getBoundingClientRect().top + currentScroll;

    const targetProgress = (section.jumpFrame - 1) / (TOTAL_FRAMES - 1);
    const targetScrollY = containerTop + targetProgress * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const activeSection =
    TOUR_SECTIONS.find(
      (sec) =>
        Math.round(smoothFrame) >= sec.startFrame &&
        Math.round(smoothFrame) <= sec.endFrame
    ) || TOUR_SECTIONS[0];

  // Auto-center active destination pill inside the horizontally scrollable mobile bar
  useEffect(() => {
    const navEl = navRef.current;
    const activeBtn = navButtonRefs.current[activeSection.id];
    if (!navEl || !activeBtn) return;

    const targetLeft =
      activeBtn.offsetLeft - navEl.clientWidth / 2 + activeBtn.clientWidth / 2;

    navEl.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [activeSection.id]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[1600vh] bg-slate-950 select-none"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-slate-950">
        {/* Scroll-Driven Frame Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Light Edge Vignette so Background Scenery Remains Fully Visible */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-950/15 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/60 to-transparent" />

        {/* Loading State Indicator */}
        {!initialLoaded && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/90 text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent mb-3" />
            <p className="text-sm tracking-widest uppercase text-slate-300">
              Loading World Tours...
            </p>
          </div>
        )}

        {/* Per-Section Tour Content on Transparent Background with Blurry Enter/Exit Animation */}
        <div className="relative z-20 mx-auto h-full max-w-7xl px-5 sm:px-10 lg:px-14 flex items-center">
          {TOUR_SECTIONS.map((tour) => {
            const visibility = getSectionVisibility(smoothFrame, tour);
            const isVisible = visibility > 0.02;
            const blurPx = (1 - visibility) * 18;
            const translateY = (1 - visibility) * 26;
            const scale = 0.96 + visibility * 0.04;

            return (
              <div
                key={tour.id}
                aria-hidden={!isVisible}
                style={{
                  opacity: visibility,
                  filter: blurPx < 0.05 ? 'none' : `blur(${blurPx.toFixed(2)}px)`,
                  transform: `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
                  transition:
                    'opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), filter 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className={`absolute left-5 sm:left-10 lg:left-14 max-w-xl w-[calc(100%-2.5rem)] sm:w-full bg-transparent p-2 sm:p-4 text-white ${
                  isVisible ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                {/* Top Location & Duration Badges */}
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/35 border border-amber-400/60 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    <svg
                      className="w-3.5 h-3.5 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {tour.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/35 border border-sky-400/50 px-3.5 py-1 text-xs font-semibold tracking-wide text-sky-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    <svg
                      className="w-3.5 h-3.5 text-sky-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {tour.duration}
                  </span>
                </div>

                {/* Tour Package Main Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4 drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                  {tour.packageTitle}
                </h2>

                {/* Package Includes Heading */}
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400 mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Package Includes:
                </p>

                {/* Package Includes Checklist */}
                <ul className="space-y-2 mb-6">
                  {tour.includes.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm sm:text-base font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 border border-emerald-400/70 text-emerald-300">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* View Full Tour Details CTA Button */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-3 text-sm sm:text-base font-bold text-slate-950 shadow-lg shadow-black/40 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] transition-all duration-200"
                  >
                    <span>View Tour Details</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Bottom Destinations Navigation Bar (Uppercase, Mobile Side Margins, Scrollable Without Scrollbar) */}
        <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-max max-w-[calc(100vw-2rem)] sm:max-w-[95vw]">
          <nav
            ref={navRef}
            aria-label="Tour Destinations"
            className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto rounded-full border border-white/15 bg-slate-950/65 backdrop-blur-md px-2.5 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.7)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {TOUR_SECTIONS.map((section) => {
              const isActive = activeSection.id === section.id;

              return (
                <button
                  key={section.id}
                  ref={(el) => {
                    navButtonRefs.current[section.id] = el;
                  }}
                  type="button"
                  onClick={() => handleJumpToSection(section)}
                  className={`shrink-0 whitespace-nowrap uppercase tracking-wider rounded-full px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30 scale-[1.03]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section.navLabel}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}