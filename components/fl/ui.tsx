"use client";
// fl/ui.tsx — shared Flux core (fl) primitives, ported from the export's ui.jsx.
// PhoneFrame / StatusBar / TabBar live in components/frame; this file holds the
// in-screen primitives. ACCENT is the JS twin of the fl.css accent tokens
// (--fl-c1 / --fl-c2 / --fl-glow-rgb) — sparklines & area charts read it. Phase 3a
// unified it to the fx canon (#7B61FF → #4A6FE8); keep it in sync with fl.css.
import React from "react";
import { Coin } from "@/components/icons";
import { fmtNum, GROWTH, FALL } from "@/lib/flux-data";

export const ACCENT = { from: "#7B61FF", to: "#4A6FE8", glow: "rgba(123,97,255,0.45)" };

// ── header (title + actions) ─────────────────────────────────
export function ScreenHeader({
  title,
  left,
  right,
}: {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="fl-screenhead">
      {left || <div style={{ minWidth: 1 }} />}
      {title && <h1 className="fl-screentitle">{title}</h1>}
      <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>{right}</div>
    </div>
  );
}

export function RoundBtn({
  children,
  onClick,
  active,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button className={"fl-roundbtn" + (active ? " active" : "")} onClick={onClick}>
      {children}
    </button>
  );
}

// ── segmented control ────────────────────────────────────────
export function Segmented({
  options,
  value,
  onChange,
  full = true,
}: {
  options: string[];
  value: string;
  onChange: (o: string) => void;
  full?: boolean;
}) {
  return (
    <div className={"fl-seg" + (full ? " full" : "")}>
      {options.map((o) => (
        <button key={o} className={"fl-seg-item" + (o === value ? " on" : "")} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ── pill chip ────────────────────────────────────────────────
export function Pill({ icon, label, color }: { icon?: React.ReactNode; label: string; color?: string }) {
  return (
    <div className="fl-pill">
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      <span style={{ color: color || "#fff" }}>{label}</span>
    </div>
  );
}

// ── primary action button ────────────────────────────────────
export function PrimaryBtn({
  label,
  icon,
  onClick,
  style,
}: {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button className="fl-primary" onClick={onClick} style={style}>
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

// ── big balance / price ──────────────────────────────────────
export function BalAmt({ n, dec = 2, hidden = false }: { n: number; dec?: number; hidden?: boolean }) {
  if (hidden) return <span className="fl-bal-amt">{"••••••"}</span>;
  return (
    <span className="fl-bal-amt">
      {fmtNum(n, dec)}
      <span className="fl-bal-cur">€</span>
    </span>
  );
}

// ── coin avatar ──────────────────────────────────────────────
export function CoinAvatar({ id, size = 40 }: { id: string; size?: number }) {
  const known = ["btc", "eth", "sol", "xrp", "zec", "uni", "ltc", "usdc"];
  if (known.includes(id)) return <Coin id={id} size={size} glowScale={0.35} />;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#222838",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {id.slice(0, 1).toUpperCase()}
    </div>
  );
}

// ── charts ───────────────────────────────────────────────────
export function smoothPath(vals: number[], w: number, h: number, pad = 4) {
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
  return {
    line: d,
    area: `${d} L ${xs(n - 1).toFixed(1)} ${h} L ${xs(0).toFixed(1)} ${h} Z`,
    xs,
    ys,
  };
}

export function Sparkline({
  vals,
  w,
  h,
  color,
  id,
  up = true,
}: {
  vals: number[];
  w: number;
  h: number;
  color?: string;
  id: string;
  up?: boolean;
}) {
  const { line, area } = smoothPath(vals, w, h, 3);
  const c = color || (up ? GROWTH : FALL);
  const gid = `sg_${id}`;
  return (
    <svg className="fl-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.28" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const TIMEFRAMES = ["1H", "1D", "1W", "1M", "6M", "1Y"];

export function AreaChart({
  vals,
  w,
  h,
  label,
  id,
}: {
  vals: number[];
  w: number;
  h: number;
  label?: string;
  id: string;
}) {
  const [tf, setTf] = React.useState("1W");
  // derive a per-timeframe variation deterministically
  const seed = TIMEFRAMES.indexOf(tf);
  const data = vals.map((v, i) => v + Math.sin(i * 0.7 + seed) * (2 + seed) + seed * 1.5);
  const { line, area, xs, ys } = smoothPath(data, w, h, 6);
  const peakIdx = data.indexOf(Math.max(...data));
  const gid = `ac_${id}`,
    lid = `acl_${id}`;

  // The tip's width varies with label length (a big BTC price runs wider than a
  // small one), so the right-edge clamp below measures the real pill instead of
  // guessing a fixed width — now that the canvas bleeds to the phone edge (no
  // padding cushion left to hide an under-measured guess), an inexact clamp
  // would let the pill overflow past the phone's right edge.
  const tipRef = React.useRef<HTMLDivElement>(null);
  const [tipW, setTipW] = React.useState(84);
  React.useLayoutEffect(() => {
    if (tipRef.current) setTipW(tipRef.current.offsetWidth);
  }, [label]);

  return (
    <div>
      {/* Bleeds the canvas to the phone edges: margin:0 -20px cancels .fl-content's
          20px padding on a width:auto block, so this div is exactly as wide as the
          phone (w, passed in by the caller as 390 — the phone's own width — so the
          SVG's coordinate space and its actual rendered pixels are the same number
          and stay pixel-accurate; no viewBox scale factor to account for). The
          timeframe row below stays out of this wrapper, at normal padding. */}
      <div style={{ position: "relative", height: h, margin: "0 -20px" }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={ACCENT.from} stopOpacity="0.45" />
              <stop offset="1" stopColor={ACCENT.from} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={lid} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={ACCENT.from} /><stop offset="1" stopColor={ACCENT.to} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g, i) => (
            <line key={i} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 5" />
          ))}
          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={`url(#${lid})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1={xs(peakIdx)} x2={xs(peakIdx)} y1={ys(data[peakIdx])} y2={h} stroke="rgba(255,255,255,0.18)" strokeDasharray="3 3" />
          <circle cx={xs(peakIdx)} cy={ys(data[peakIdx])} r="5" fill="#fff" stroke={ACCENT.from} strokeWidth="2.5" />
        </svg>
        {label && (
          <div
            ref={tipRef}
            className="fl-chart-tip"
            style={{
              left: Math.min(Math.max(xs(peakIdx) - 36, 4), w - tipW - 4),
              top: Math.max(ys(data[peakIdx]) - 30, 2),
            }}
          >
            {label}
          </div>
        )}
      </div>
      <div className="fl-tf-row">
        {TIMEFRAMES.map((t) => (
          <button key={t} className={"fl-tf" + (t === tf ? " on" : "")} onClick={() => setTf(t)}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
