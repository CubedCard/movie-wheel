"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Movie } from "@/lib/movies";

const RENDER_RADIUS = 5;
const SPIN_LOOPS = 3;
const SPIN_DURATION = 3200;

function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

export default function MovieWheel({ movies }: { movies: Movie[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(360);
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const { cardWidth, spacing } = useMemo(() => {
    const cardWidth = Math.min(300, Math.max(130, containerWidth * 0.56));
    const spacing = cardWidth * 0.68;
    return { cardWidth, spacing };
  }, [containerWidth]);

  const n = movies.length;

  function spin() {
    if (spinning || n === 0) return;
    setSpinning(true);
    setSelected(null);

    const currentMod = mod(Math.round(offset), n);
    const targetActual = Math.floor(Math.random() * n);
    const diff = mod(targetActual - currentMod, n) || n; // always move forward at least one full lap
    const targetOffset = offset + SPIN_LOOPS * n + diff;

    const start = offset;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / SPIN_DURATION, 1);
      const eased = easeOutQuint(t);
      const value = start + (targetOffset - start) * eased;
      setOffset(value);

      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        const landedActual = mod(Math.round(targetOffset), n);
        setOffset(targetOffset);
        setSpinning(false);
        setSelected(movies[landedActual]);
      }
    };

    animRef.current = requestAnimationFrame(step);
  }

  const centerIndex = Math.round(offset);
  const cards = [];
  for (let i = centerIndex - RENDER_RADIUS; i <= centerIndex + RENDER_RADIUS; i++) {
    if (n === 0) break;
    const movie = movies[mod(i, n)];
    const distance = i - offset;
    const absDistance = Math.abs(distance);
    if (absDistance > RENDER_RADIUS) continue;

    const scale = Math.max(0.35, 1 - absDistance * 0.22);
    const blur = absDistance < 0.15 ? 0 : Math.min(absDistance * 2.2, 8);
    const opacity = Math.max(0, 1 - absDistance * 0.28);
    const translateX = distance * spacing;
    const zIndex = Math.round(1000 - absDistance * 10);

    cards.push(
      <div
        key={i}
        className="absolute top-1/2 left-1/2"
        style={{
          width: cardWidth,
          marginLeft: -cardWidth / 2,
          transform: `translate(${translateX}px, -50%) scale(${scale})`,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          opacity,
          zIndex,
          transition: spinning ? undefined : "transform 0.2s ease-out",
        }}
      >
        <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div
        ref={containerRef}
        className="relative h-[60vh] max-h-[480px] min-h-[260px] w-full select-none overflow-hidden"
      >
        {n === 0 ? (
          <p className="absolute inset-0 flex items-center justify-center text-center text-neutral-400">
            No movies yet. Add some from the admin page.
          </p>
        ) : (
          cards
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={spin}
          disabled={spinning || n === 0}
          className="rounded-full bg-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>

        <div className="h-14 text-center">
          {selected && !spinning && (
            <p className="text-lg font-medium text-neutral-100">
              🎬 {selected.title}
              {selected.year ? ` (${selected.year})` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
