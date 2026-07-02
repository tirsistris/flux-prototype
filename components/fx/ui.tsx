// fx/ui.tsx — shared Flux onboarding/login (fx) primitives, ported from the
// export's screens.jsx. Phase 3b adds the onboarding illustrations (CoinCluster,
// MiniPortfolio, SecurityShield), the FxPhone chassis wrapper and SuccessOverlay.
import React from "react";
import { Coin, Ico } from "@/components/icons";
import { StatusBar } from "@/components/frame/StatusBar";

export type FxTheme = {
  accent: { from: string; to: string; glow: string };
  radius: number;
  slogan?: string;
};

// Unified fx accent (#7B61FF → #4A6FE8), per phase-1 decision 3.
export const FX_THEME: FxTheme = {
  accent: { from: "#7B61FF", to: "#4A6FE8", glow: "rgba(74,111,232,0.45)" },
  radius: 16,
  slogan: "Crypto, finally made simple.", // verbatim from the fx onboarding board
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 40 }}>
      {onBack ? (
        <button className="fx-icon-btn" onClick={onBack} aria-label="Back">
          {Ico.chevL("rgba(255,255,255,0.85)", 22)}
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      {onSkip ? (
        <button className="fx-skip" onClick={onSkip}>
          Skip
        </button>
      ) : (
        <div style={{ width: 40 }} />
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

// ── typography helpers (ported from screens.jsx) ─────────────
export const Heading = ({ children }: { children: React.ReactNode }) => <h1 className="fx-h1">{children}</h1>;
export const Body = ({ children }: { children: React.ReactNode }) => <p className="fx-body">{children}</p>;

// ── fx phone chassis wrapper ─────────────────────────────────
// Mirrors the inline chassis app/login uses (device-stage → fx-phone → herohlow
// + island + StatusBar + home indicator), so onboarding pages don't repeat it.
const FX_GLOW = "radial-gradient(125% 62% at 50% -8%, rgba(123,97,255,0.34), rgba(74,111,232,0.12) 42%, transparent 70%)";
export function FxPhone({ children }: { children: React.ReactNode }) {
  return (
    <div className="device-stage">
      <div className="fx-phone">
        <div className="fx-herohlow" style={{ background: FX_GLOW }} />
        <div className="fx-island" />
        <StatusBar system="fx" />
        {children}
        <div className="fx-home-ind" />
      </div>
    </div>
  );
}

// ── onboarding illustrations (ported from screens.jsx) ───────
// Positioning/markup is verbatim; the float/ring MOTION is authored in fx.css
// (the print export shipped none) — see the AUTHORED note there.
export function CoinCluster() {
  const items = [
    { id: "btc", size: 96, x: 0, y: 0, z: 3, delay: 0 },
    { id: "eth", size: 64, x: -104, y: -26, z: 2, delay: 0.6 },
    { id: "sol", size: 56, x: 96, y: -44, z: 2, delay: 1.1 },
    { id: "usdc", size: 50, x: 108, y: 58, z: 1, delay: 0.3 },
    { id: "xrp", size: 44, x: -110, y: 64, z: 1, delay: 0.9 },
    { id: "uni", size: 38, x: -8, y: 96, z: 1, delay: 1.4 },
  ];
  return (
    <div style={{ position: "relative", width: 280, height: 248, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: "8% 14%", borderRadius: "50%", background: "radial-gradient(circle, rgba(123,97,255,0.30), transparent 68%)", filter: "blur(8px)" }} />
      {items.map((it, i) => (
        <div
          key={i}
          className="fx-float"
          style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(calc(-50% + ${it.x}px), calc(-50% + ${it.y}px))`,
            zIndex: it.z, animationDelay: `${it.delay}s`, opacity: it.z === 1 ? 0.92 : 1,
          }}
        >
          <Coin id={it.id} size={it.size} />
        </div>
      ))}
    </div>
  );
}

export function MiniPortfolio({ T }: { T: FxTheme }) {
  const vals = [4, 5, 4.4, 6, 5.6, 7.4, 7, 8.6, 8.2, 9.6, 10.2, 11];
  return (
    <div style={{ position: "relative", width: 260, margin: "0 auto" }}>
      <div className="fx-card" style={{ borderRadius: 22, padding: "18px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Coin id="btc" size={34} glowScale={0.4} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Your first €1</span>
            <span style={{ fontSize: 12, color: "rgba(235,235,245,0.5)" }}>Bitcoin · BTC</span>
          </div>
          <div className="fx-pill-green" style={{ marginLeft: "auto" }}>+3.1%</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>€1.03</div>
        <div style={{ fontSize: 12.5, color: "#3FD68C", fontWeight: 600, marginTop: 2, marginBottom: 8 }}>+€0.03 today</div>
        <Sparkline vals={vals} w={224} h={62} T={T} id="mini" />
      </div>
      <div className="fx-float fx-euro" style={{ left: -22, top: 150, animationDelay: ".2s" }}>€1</div>
      <div className="fx-float fx-euro" style={{ right: -18, top: 150, animationDelay: "1s" }}>€1</div>
    </div>
  );
}

export function SecurityShield({ T }: { T: FxTheme }) {
  return (
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {[210, 168, 130].map((d, i) => (
        <div
          key={i}
          className="fx-ring"
          style={{ position: "absolute", width: d, height: d, borderRadius: "50%", border: `1px solid rgba(123,97,255,${0.05 + i * 0.05})`, animationDelay: `${i * 0.4}s` }}
        />
      ))}
      <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,97,255,0.30), transparent 70%)", filter: "blur(6px)" }} />
      <div
        style={{
          width: 104, height: 116, position: "relative",
          clipPath: 'path("M52 2 C52 2 96 14 96 14 L96 60 C96 92 74 108 52 116 C30 108 8 92 8 60 L8 14 C8 14 52 2 52 2 Z")',
          background: `linear-gradient(150deg, ${T.accent.from}, ${T.accent.to})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 18px 44px ${T.accent.glow}`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent 45%)" }} />
        {Ico.lock("#fff", 40)}
      </div>
    </div>
  );
}

// ── success overlay (ported; CTA repointed to /home for the golden path) ──────
// Body copy is verbatim from screens.jsx. The source button was "Back to start"
// (demo-loop reset); here the CTA takes the source's own body phrase, "Let's buy
// your first crypto", and onDone leads into the app. Overlay CSS is authored.
export function SuccessOverlay({ T, onDone }: { T: FxTheme; onDone?: () => void }) {
  return (
    <div className="fx-overlay">
      <div className="fx-success-card" style={{ width: "100%", maxWidth: 320 }}>
        <div className="fx-success-badge" style={{ background: `linear-gradient(150deg, ${T.accent.from}, ${T.accent.to})`, boxShadow: `0 16px 40px ${T.accent.glow}` }}>
          {Ico.check("#fff", 38)}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "22px 0 6px" }}>You&apos;re all set</h2>
        <p style={{ fontSize: 15, color: "rgba(235,235,245,0.6)", margin: "0 0 24px", lineHeight: 1.5 }}>Welcome to Flux. Let&apos;s buy your first crypto.</p>
        <PrimaryButton label="Let's buy your first crypto" onClick={onDone} T={T} />
      </div>
    </div>
  );
}
