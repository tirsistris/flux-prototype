"use client";
// components/FaceId.tsx — a minimal stand-in for the system Face ID indicator
// (not in the design; modelled on iOS: a dark translucent rounded square with the
// face glyph, then a check). Runs ~1 s, then calls onDone.
import React from "react";
import { IconFace } from "@/components/icons";

export function FaceId({ onDone }: { onDone: () => void }) {
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    const a = window.setTimeout(() => setOk(true), 650);
    const b = window.setTimeout(onDone, 1050);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [onDone]);
  return (
    <div className="faceid-scrim" role="status" aria-live="assertive" aria-label={ok ? "Face ID recognised" : "Face ID"}>
      <div className={"faceid-hud" + (ok ? " ok" : "")}>
        {ok ? (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M18 33.5L27.5 43L46 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="faceid-check" />
          </svg>
        ) : (
          <IconFace size={64} className="faceid-face" />
        )}
        <span>Face ID</span>
      </div>
    </div>
  );
}
