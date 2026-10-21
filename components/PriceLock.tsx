"use client";
// components/PriceLock.tsx — the 30 s price lock on Review screens (Buy 4, Swap 2,
// Sell 2): the "Price locked" countdown with its track, and the expired banner
// (Figma Swap · Quote expired 2300:3519) that replaces it at 0:00.
import React from "react";
import { IconTimer, IconTimer22 } from "@/components/icons";
import { QUOTE_TTL_MS } from "@/lib/legend";

/** Ticks every 100 ms while `active`. */
export function useNow(active: boolean) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

/** Time left on a lock; before the first lock exists, the full 30 s. */
export function useLockClock(expiresAt: number | null) {
  const now = useNow(expiresAt !== null);
  // Clamp: right after a refresh `now` is up to one tick old.
  const remaining = expiresAt === null ? QUOTE_TTL_MS : Math.min(QUOTE_TTL_MS, Math.max(0, expiresAt - now));
  return { remaining, expired: expiresAt !== null && remaining === 0 };
}

export function PriceLock({ remaining }: { remaining: number }) {
  const secs = Math.ceil(remaining / 1000);
  return (
    <div className="price-lock">
      <div className="row">
        <IconTimer />
        <span>Price locked</span>
        <span className="count" aria-live="off">
          0:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="track" role="progressbar" aria-label="Time left on locked price" aria-valuemin={0} aria-valuemax={QUOTE_TTL_MS / 1000} aria-valuenow={secs}>
        <div className="fill" style={{ transform: `scaleX(${remaining / QUOTE_TTL_MS})` }} />
      </div>
    </div>
  );
}

export function LockExpired({ body }: { body: string }) {
  return (
    <div className="banner banner-loss" role="alert">
      <span className="banner-icon">
        <IconTimer22 />
      </span>
      <span className="banner-text">
        <span className="banner-title">Your price lock ran out</span>
        <span className="banner-body">{body}</span>
      </span>
    </div>
  );
}
