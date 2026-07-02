// icons.tsx — Flux token coins + UI glyphs, ported from the export's icons.jsx.
// Coin marks are abstract/original (letters + simple geometry), not brand logos.
import React from "react";

type CoinDef = {
  bg: string;
  glow: string;
  glyph: (s: number) => React.ReactNode;
};

export const COINS: Record<string, CoinDef> = {
  btc: {
    bg: "radial-gradient(120% 120% at 30% 20%, #FBB552, #F7931A 55%, #E07C0A)",
    glow: "rgba(247,147,26,0.45)",
    glyph: (s) => <span style={{ fontSize: s * 0.56, fontWeight: 800, color: "#fff", lineHeight: 1 }}>₿</span>,
  },
  eth: {
    bg: "radial-gradient(120% 120% at 30% 20%, #8A93FF, #5B6CE8 55%, #4254C9)",
    glow: "rgba(91,108,232,0.45)",
    glyph: (s) => (
      <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 24 36" fill="none">
        <path d="M12 0L12 14.2L23 19.2L12 0Z" fill="#fff" fillOpacity="0.95" />
        <path d="M12 0L1 19.2L12 14.2L12 0Z" fill="#fff" fillOpacity="0.7" />
        <path d="M12 16.4L1 21.4L12 36L23 21.4L12 16.4Z" fill="#fff" fillOpacity="0.85" />
      </svg>
    ),
  },
  sol: {
    bg: "radial-gradient(120% 120% at 25% 15%, #2A2F3A, #15181F)",
    glow: "rgba(20,241,149,0.30)",
    glyph: (s) => (
      <svg width={s * 0.52} height={s * 0.52} viewBox="0 0 28 24" fill="none">
        <defs>
          <linearGradient id="solg" x1="0" y1="0" x2="28" y2="24">
            <stop offset="0" stopColor="#9945FF" /><stop offset="1" stopColor="#14F195" />
          </linearGradient>
        </defs>
        <path d="M5 4h18l-4 4H1l4-4Z" fill="url(#solg)" />
        <path d="M5 10h18l-4 4H1l4-4Z" fill="url(#solg)" />
        <path d="M5 16h18l-4 4H1l4-4Z" fill="url(#solg)" />
      </svg>
    ),
  },
  xrp: {
    bg: "radial-gradient(120% 120% at 30% 20%, #3A4150, #20252E)",
    glow: "rgba(120,140,170,0.35)",
    glyph: (s) => (
      <svg width={s * 0.46} height={s * 0.46} viewBox="0 0 24 20" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
        <path d="M2 2c3 4 7 4 10 0M22 2c-3 4-7 4-10 0" />
        <path d="M2 18c3-4 7-4 10 0M22 18c-3-4-7-4-10 0" />
      </svg>
    ),
  },
  usdc: {
    bg: "radial-gradient(120% 120% at 30% 20%, #4D93E6, #2775CA 55%, #1E63B0)",
    glow: "rgba(39,117,202,0.42)",
    glyph: (s) => <span style={{ fontSize: s * 0.5, fontWeight: 700, color: "#fff", lineHeight: 1 }}>$</span>,
  },
  uni: {
    bg: "radial-gradient(120% 120% at 30% 20%, #FF5BA8, #FF007A 60%, #D60068)",
    glow: "rgba(255,0,122,0.40)",
    glyph: (s) => <span style={{ fontSize: s * 0.46, fontWeight: 800, color: "#fff", lineHeight: 1 }}>U</span>,
  },
  zec: {
    bg: "radial-gradient(120% 120% at 30% 20%, #F9C552, #F4B728 55%, #D99700)",
    glow: "rgba(244,183,40,0.42)",
    glyph: (s) => <span style={{ fontSize: s * 0.5, fontWeight: 800, color: "#3A2A00", lineHeight: 1 }}>ⓩ</span>,
  },
  ltc: {
    bg: "radial-gradient(120% 120% at 30% 20%, #6FA6E8, #345D9D 55%, #28477A)",
    glow: "rgba(52,93,157,0.42)",
    glyph: (s) => <span style={{ fontSize: s * 0.52, fontWeight: 700, color: "#fff", lineHeight: 1, fontStyle: "italic" }}>Ł</span>,
  },
};

export function Coin({
  id,
  size = 44,
  glowScale = 1,
  style = {},
}: {
  id: string;
  size?: number;
  glowScale?: number;
  style?: React.CSSProperties;
}) {
  const C = COINS[id] || COINS.btc;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 ${size * 0.16 * glowScale}px ${size * 0.46 * glowScale}px ${C.glow}, inset 0 1.5px 1.5px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)`,
        flexShrink: 0,
        ...style,
      }}
    >
      {C.glyph(size)}
    </div>
  );
}

// ── UI glyphs (stroke icons) ──────────────────────────────────
type Glyph = (c?: string, w?: number, fill?: boolean) => React.ReactElement;

export const Ico: Record<string, Glyph> = {
  chevL: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
  ),
  chevR: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
  ),
  arrowR: (c = "#fff", w = 20) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
  ),
  card: (c = "#fff", w = 26) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 9.5h19M6 15h4" /></svg>
  ),
  faceid: (c = "#fff", w = 26) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
      <path d="M9 10v1M15 10v1M12 9v3.5a1.2 1.2 0 01-1.2 1.2M9.2 16c1.6 1.2 4 1.2 5.6 0" />
    </svg>
  ),
  lock: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7a4 4 0 018 0v3.5" /><circle cx="12" cy="15.2" r="1.3" fill={c} stroke="none" /></svg>
  ),
  check: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
  ),
  apple: (c = "#fff", w = 20) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill={c}><path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.05 1.6-.75 3-.75s1.8.75 3 .73c1.2-.02 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.03-.01-2.4-.92-2.4-3.5ZM14.1 5.8c.65-.8 1.1-1.9 1-3-.95.04-2.1.63-2.8 1.42-.6.7-1.15 1.83-1 2.9 1.05.08 2.13-.53 2.8-1.32Z" /></svg>
  ),
  google: (c = "#fff", w = 19) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.2c0 5-3.4 8.3-8.5 8.3A8.5 8.5 0 1112.5 3.5c2.3 0 4.2.85 5.6 2.2l-2.4 2.3c-.6-.6-1.66-1.3-3.2-1.3a5.3 5.3 0 100 10.6c3.1 0 4.5-2.2 4.7-3.6h-4.7v-3.1H21c.05.4.05.7.05 1.6Z" /></svg>
  ),
  search: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
  ),
  star: (c = "#fff", w = 22, fill = false) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill={fill ? c : "none"} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 17.8 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3Z" /></svg>
  ),
  bank: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 4l9 5.5M5 10v8M19 10v8M9.5 10v8M14.5 10v8M3 21h18" /></svg>
  ),
  backspace: (c = "#fff", w = 26) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 5H8.5L3 12l5.5 7H21a1 1 0 001-1V6a1 1 0 00-1-1ZM11.5 9.5l5 5M16.5 9.5l-5 5" /></svg>
  ),
  camera: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5a2 2 0 012-2h1.6L8 4.5h8l1.4 2H19a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2V8.5Z" /><circle cx="12" cy="12.8" r="3.4" /></svg>
  ),
  external: (c = "#fff", w = 18) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4l-8.5 8.5M18 13.5V18a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4.5" /></svg>
  ),
  close: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  plus: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
  ),
  chevD: (c = "#fff", w = 20) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7 7 7-7" /></svg>
  ),
  eye: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  eyeOff: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.6 6.2A9.7 9.7 0 0112 6c6.4 0 10 6 10 6a16 16 0 01-3.3 4M6.6 6.7C3.7 8.3 2 12 2 12s3.6 7 10 7a9.7 9.7 0 004.1-.9M9.9 9.9a3 3 0 004.2 4.2" /></svg>
  ),
  receive: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></svg>
  ),
  send: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3L10.5 13.5M21 3l-6.6 18-3.9-8.1L2.4 9 21 3Z" /></svg>
  ),
  swap: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 4l3 3-3 3M20 7H8M7 20l-3-3 3-3M4 17h12" /></svg>
  ),
  scan: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2M3 12h18" /></svg>
  ),
  copy: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V5a2 2 0 012-2h8" /></svg>
  ),
  share: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V4M8.5 7.5L12 4l3.5 3.5M6 12v6a2 2 0 002 2h8a2 2 0 002-2v-6" /></svg>
  ),
  sliders: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2.2" /><circle cx="8" cy="17" r="2.2" /></svg>
  ),
  menu: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
  ),
  dots: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill={c}><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
  ),
  bell: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></svg>
  ),
  user: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
  ),
  shield: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" /></svg>
  ),
  globe: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" /></svg>
  ),
  crown: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8Z" /></svg>
  ),
  edit: (c = "#fff", w = 20) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4" /></svg>
  ),
  logout: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 17l5-5-5-5M21 12H9" /></svg>
  ),
  swapV: (c = "#fff", w = 22) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v12M4 13l3 3 3-3M17 20V8M14 11l3-3 3 3" /></svg>
  ),
  tabHome: (c = "#fff", w = 24, fill = false) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill={fill ? c : "none"} stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l8-7 8 7M6 10v9h12v-9" /></svg>
  ),
  tabMarkets: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16l4-5 4 3 4-7 4 5" /><circle cx="8" cy="11" r="1" fill={c} /><circle cx="16" cy="7" r="1" fill={c} /></svg>
  ),
  tabWallet: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18" /><circle cx="16.5" cy="13.5" r="1.2" fill={c} /></svg>
  ),
  tabTrade: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="4.2" /><circle cx="15" cy="15" r="4.2" /></svg>
  ),
  tabProfile: (c = "#fff", w = 24) => (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></svg>
  ),
};
