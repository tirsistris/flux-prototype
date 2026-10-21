// components/ui.tsx — Flux v2 building blocks, one per component in the Figma
// "Компоненты" section (2289:772): Button, Icon button, Header, Detail row, Chip,
// Keypad, Receipt edge, Perforation, Divider, Coin, unit switch (€ ⇄ BTC).
import React from "react";
import Image from "next/image";
import { IconBack, IconBackspace, IconClose, IconTransferV } from "@/components/icons";

// ── Coin ─────────────────────────────────────────────────────────────────────
// DOT / ADA: SVG export of the Figma Coin variants 2351:774 / 2351:782 (served as-is).
const COIN_IMG = {
  BTC: "/img/coin-btc.png",
  ETH: "/img/coin-eth.png",
  SOL: "/img/coin-sol.png",
  DOT: "/img/coin-dot.svg",
  ADA: "/img/coin-ada.svg",
} as const;

export function Coin({ asset, size = 40 }: { asset: keyof typeof COIN_IMG | "EUR"; size?: number }) {
  if (asset === "EUR") {
    return (
      <span className="coin-eur" style={{ width: size, height: size, fontSize: Math.round(size * 0.475) }} aria-hidden="true">
        €
      </span>
    );
  }
  const src = COIN_IMG[asset];
  return <Image src={src} alt="" width={size} height={size} className="coin" unoptimized={src.endsWith(".svg")} />;
}

// ── Icon button (44 px chip circle) ─────────────────────────────────────────
export function IconButton({
  label,
  onClick,
  children,
  inert,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  inert?: boolean;
}) {
  return (
    <button type="button" className="icon-btn" aria-label={label} onClick={onClick} disabled={inert} data-inert={inert || undefined}>
      {children}
    </button>
  );
}

// ── Screen header: leading button, centred title, 44 px trailing slot ────────
export function ScreenHeader({
  leading = "back",
  onLeading,
  title,
  coin,
  trailing,
}: {
  leading?: "back" | "close";
  onLeading: () => void;
  title?: string;
  coin?: "BTC" | "ETH";
  trailing?: React.ReactNode;
}) {
  return (
    <header className="screen-header">
      <IconButton label={leading === "back" ? "Back" : "Close"} onClick={onLeading}>
        {leading === "back" ? <IconBack /> : <IconClose />}
      </IconButton>
      <div className="screen-header-title">
        {coin && <Coin asset={coin} size={24} />}
        {title && <span>{title}</span>}
      </div>
      <div className="screen-header-trailing">{trailing}</div>
    </header>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────
export type ButtonStyle = "primary" | "secondary" | "destructive" | "applepay";

export function Button({
  variant = "primary",
  disabled,
  onClick,
  glyph,
  children,
}: {
  variant?: ButtonStyle;
  disabled?: boolean;
  onClick?: () => void;
  glyph?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
      {glyph}
      <span>{children}</span>
    </button>
  );
}

// ── Detail row ──────────────────────────────────────────────────────────────
// `ui` sets the value in the system font (prose values such as "Apple Pay").
export function DetailRow({ label, value, strong, ui }: { label: string; value: React.ReactNode; strong?: boolean; ui?: boolean }) {
  return (
    <div className={"detail-row" + (strong ? " strong" : "")}>
      <span className="detail-label">{label}</span>
      <span className={"detail-value" + (ui ? " ui" : "")}>{value}</span>
    </div>
  );
}

export function Divider({ inset }: { inset?: boolean }) {
  return <div className={"divider" + (inset ? " inset" : "")} />;
}

// ── Chip ────────────────────────────────────────────────────────────────────
export function Chip({ selected, onClick, children }: { selected?: boolean; onClick?: () => void; children: React.ReactNode }) {
  if (!onClick) {
    return <span className={"chip" + (selected ? " selected" : "")}>{children}</span>;
  }
  return (
    <button type="button" className={"chip" + (selected ? " selected" : "")} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  );
}

// ── Keypad ──────────────────────────────────────────────────────────────────
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "del"];

export function Keypad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className="keypad">
      {KEYS.map((k) => (
        <button key={k} type="button" className="key" onClick={() => onKey(k)} aria-label={k === "del" ? "Delete" : k === "," ? "Decimal comma" : k}>
          {k === "del" ? <IconBackspace /> : k}
        </button>
      ))}
    </div>
  );
}

// ── Receipt paper: perforation and toothed edge ─────────────────────────────
// Geometry from Figma "Perforation" 2292:1073 and "Receipt edge" 2292:1071.
export function Perforation() {
  return (
    <div className="perforation" aria-hidden="true">
      <span className="notch left" />
      <span className="dash" />
      <span className="notch right" />
    </div>
  );
}

export function ReceiptEdge() {
  return (
    <svg className="receipt-edge" viewBox="0 0 361 10" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 0H361V2L354.98 10L348.97 2V2L342.95 10L336.93 2V2L330.92 10L324.9 2V2L318.88 10L312.87 2V2L306.85 10L300.83 2V2L294.82 10L288.8 2V2L282.78 10L276.77 2V2L270.75 10L264.73 2V2L258.72 10L252.7 2V2L246.68 10L240.67 2V2L234.65 10L228.63 2V2L222.62 10L216.6 2V2L210.58 10L204.57 2V2L198.55 10L192.53 2V2L186.52 10L180.5 2V2L174.48 10L168.47 2V2L162.45 10L156.43 2V2L150.42 10L144.4 2V2L138.38 10L132.37 2V2L126.35 10L120.33 2V2L114.32 10L108.3 2V2L102.28 10L96.27 2V2L90.25 10L84.23 2V2L78.22 10L72.2 2V2L66.18 10L60.17 2V2L54.15 10L48.13 2V2L42.12 10L36.1 2V2L30.08 10L24.07 2V2L18.05 10L12.03 2V2L6.02 10L0 2V0Z"
      />
    </svg>
  );
}

export function Receipt({ children }: { children: React.ReactNode }) {
  return (
    <div className="receipt">
      <div className="receipt-paper">{children}</div>
      <ReceiptEdge />
    </div>
  );
}

// ── € ⇄ BTC unit switch (Figma "Unit switch" 2351:15980) ────────────────────
export function UnitSwitch({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button type="button" className="unit-switch" onClick={onClick} aria-label={label}>
      {children}
      <IconTransferV />
    </button>
  );
}

// ── Note (icon + 13 px muted text) ──────────────────────────────────────────
export function Note({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="note">
      <span className="note-icon">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

// ── Radio (Figma 22 px, on = 7 px ring) ─────────────────────────────────────
export function Radio({ on }: { on: boolean }) {
  return <span className={"radio" + (on ? " on" : "")} aria-hidden="true" />;
}
