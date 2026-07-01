// fx/ui.tsx — shared Flux onboarding/login (fx) primitives, ported from the
// export's screens.jsx. The onboarding illustrations (CoinCluster,
// MiniPortfolio, SecurityShield) land in phase 3 with the onboarding screens.
import React from "react";
import { Coin, Ico } from "@/components/icons";

export type FxTheme = {
  accent: { from: string; to: string; glow: string };
  radius: number;
  slogan?: string;
};

// Unified fx accent (#7B61FF → #4A6FE8), per phase-1 decision 3.
export const FX_THEME: FxTheme = {
  accent: { from: "#7B61FF", to: "#4A6FE8", glow: "rgba(74,111,232,0.45)" },
  radius: 16,
  slogan: "Crypto, made simple",
};

export function areaPath(vals: number[], w: number, h: number, pad = 3) {
  const n = vals.length,
    max = Math.max(...vals),
    min = Math.min(...vals);
  const xs = (i: number) => pad + (i * (w - 2 * pad)) / (n - 1);
  const ys = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - 2 * pad);
  let d = `M ${xs(0).toFixed(1)} ${ys(vals[0]).toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = xs(i),
      y0 = ys(vals[i]),
      x1 = xs(i + 1),
      y1 = ys(vals[i + 1]);
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return { line: d, area: `${d} L ${xs(n - 1).toFixed(1)} ${h} L ${xs(0).toFixed(1)} ${h} Z` };
}

export function Sparkline({ vals, w, h, T, id }: { vals: number[]; w: number; h: number; T: FxTheme; id: string }) {
  const { line, area } = areaPath(vals, w, h, 4);
  const gid = `g_${id}`,
    lid = `l_${id}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.accent.to} stopOpacity="0.42" />
          <stop offset="1" stopColor={T.accent.to} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={lid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={T.accent.from} /><stop offset="1" stopColor={T.accent.to} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={`url(#${lid})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PrimaryButton({
  label,
  onClick,
  T,
  icon,
}: {
  label: string;
  onClick?: () => void;
  T: FxTheme;
  icon?: React.ReactNode;
}) {
  return (
    <button
      className="fx-primary"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${T.accent.from}, ${T.accent.to})`,
        borderRadius: T.radius,
        boxShadow: `0 12px 34px ${T.accent.glow}, inset 0 1px 0 rgba(255,255,255,0.28)`,
      }}
    >
      <span>{label}</span>
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
    </button>
  );
}

export function Dots({ active, total, T }: { active: number; total: number; T: FxTheme }) {
  return (
    <div style={{ display: "flex", gap: 7, alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 6,
            borderRadius: 99,
            transition: "all .35s cubic-bezier(.22,1,.36,1)",
            width: i === active ? 22 : 6,
            background:
              i === active ? `linear-gradient(90deg, ${T.accent.from}, ${T.accent.to})` : "rgba(255,255,255,0.16)",
          }}
        />
      ))}
    </div>
  );
}

export function TopChrome({ onBack, onSkip }: { onBack?: () => void; onSkip?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 36 }}>
      {onBack ? (
        <button className="fx-icon-btn" onClick={onBack} aria-label="Back">
          {Ico.chevL("rgba(255,255,255,0.85)", 22)}
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      {onSkip ? (
        <button className="fx-skip" onClick={onSkip}>
          Skip
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
    </div>
  );
}

export function Chip({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <div className="fx-chip">
      <span style={{ display: "flex", opacity: 0.9 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export function FluxLogo({ T, size = 64 }: { T: FxTheme; size?: number }) {
  const v = [3, 5, 4, 7, 6, 9];
  const { line } = areaPath(v, size * 0.62, size * 0.42, 2);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          background: `linear-gradient(150deg, ${T.accent.from}, ${T.accent.to})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 16px 40px ${T.accent.glow}, inset 0 1.5px 0 rgba(255,255,255,0.3)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent 50%)" }} />
        <svg width={size * 0.62} height={size * 0.42} viewBox={`0 0 ${size * 0.62} ${size * 0.42}`} style={{ position: "relative" }}>
          <path d={line} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={size * 0.62 - 2} cy={size * 0.42 * (1 - (9 - 3) / (9 - 3)) + 2} r="3.2" fill="#fff" />
        </svg>
      </div>
      <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Flux</span>
    </div>
  );
}
