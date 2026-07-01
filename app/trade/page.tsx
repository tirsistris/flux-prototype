"use client";
// app/trade/page.tsx — Flux Trade (fl system), ported from screen-trade.jsx.
// The header / balance / Buy·Sell toggle / stat grid / chart / Convert widget are
// a faithful port; the live swap-flip on the Convert widget is source behaviour.
//
// AUTHORED (not present in screen-trade.jsx): the two CTA buttons below. The source
// screen had no action button — a trade prototype needs one — so phase 4a adds:
//   • primary CTA bound to the Buy/Sell toggle: Buy → /buy (the real buy flow),
//     Sell → disabled "Selling — coming soon" (no sell flow exists yet).
//   • Convert CTA → disabled placeholder; the convert flow is TODO(4b).
// Trade is BTC-only here, matching the source (c = FLUX.coins.btc throughout).
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { AreaChart, CoinAvatar, BalAmt } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, pct, signEur, fmtNum, chColor } from "@/lib/flux-data";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="fl-card fl-stat-card">
      <span style={{ fontSize: 12.5, color: "#8A91A3" }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 6, letterSpacing: -0.3 }}>{value}</span>
      {sub && <span style={{ fontSize: 11.5, color: "#8A91A3", marginTop: 1 }}>{sub}</span>}
    </div>
  );
}

export default function TradePage() {
  const router = useRouter();
  const c = FLUX.coins.btc;
  const dayAbs = c.price - c.price / (1 + c.ch / 100);
  const [dir, setDir] = React.useState<"Buy" | "Sell">("Buy");
  const [swapped, setSwapped] = React.useState(false);

  const payAmt = 0.1,
    payCoin = FLUX.coins.btc;
  const payVal = payAmt * payCoin.price;
  const recCoin = FLUX.coins.eth;
  const recVal = payVal * (1 - 0.0024); // small conversion spread
  const recAmt = recVal / recCoin.price;

  const pay = swapped
    ? { coin: recCoin, amt: recAmt, val: recVal }
    : { coin: payCoin, amt: payAmt, val: payVal };
  const rec = swapped
    ? { coin: payCoin, amt: payAmt, val: payVal }
    : { coin: recCoin, amt: recAmt, val: recVal };

  return (
    <PhoneFrame active="trade" scroll>
      <div className="fl-wallet-head">
        <button className="fl-cur-sel">EUR {Ico.chevD("rgba(255,255,255,0.6)", 16)}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="fl-wallet-title">{c.name}</span>
          <CoinAvatar id="btc" size={22} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="fl-roundbtn sm">{Ico.chevD("rgba(255,255,255,0.7)", 16)}</button>
          <button className="fl-roundbtn sm">{Ico.dots("rgba(255,255,255,0.7)", 18)}</button>
        </div>
      </div>

      <div className="fl-balance center">
        <BalAmt n={c.price} />
        <div className="fl-bal-change" style={{ color: chColor(c.ch) }}>{signEur(dayAbs)} ({pct(c.ch)})</div>
      </div>

      <div className="fl-buysell">
        <button className={"fl-bs" + (dir === "Buy" ? " on buy" : "")} onClick={() => setDir("Buy")}>
          <span className="fl-bs-ico">{Ico.receive(dir === "Buy" ? "#fff" : "rgba(255,255,255,0.7)", 20)}</span>Buy
        </button>
        <button className={"fl-bs" + (dir === "Sell" ? " on sell" : "")} onClick={() => setDir("Sell")}>
          <span className="fl-bs-ico">{Ico.send(dir === "Sell" ? "#fff" : "rgba(255,255,255,0.7)", 20)}</span>Sell
        </button>
      </div>

      <div className="fl-stat-grid">
        <StatCard label="24h High" value={eur(108240)} />
        <StatCard label="24h Vol" value={"45,2 M €"} sub="across pairs" />
      </div>

      <div style={{ marginTop: 16 }}>
        <AreaChart vals={FLUX.curve} w={342} h={118} label={eur(c.price * 0.9784)} id="trade" />
      </div>

      {/* AUTHORED: primary CTA driven by the Buy/Sell toggle (no button in source).
          flexShrink:0 pins the 54px height — .fl-content is a flex COLUMN and this
          screen's children over-fill it, so an unpinned .fl-primary gets shrunk to
          its text height. Same class-in-a-column trap as /buy/success. */}
      {dir === "Buy" ? (
        <button className="fl-primary" style={{ marginTop: 16, flexShrink: 0 }} onClick={() => router.push("/buy")}>
          {Ico.receive("#fff", 20)}Buy {c.name}
        </button>
      ) : (
        <button className="fl-primary" style={{ marginTop: 16, flexShrink: 0 }} disabled>
          Selling — coming soon
        </button>
      )}

      <div className="fl-sec-head" style={{ marginTop: 14 }}>
        <span className="fl-sec-title">Convert</span>
      </div>
      <div className="fl-convert">
        <div className="fl-conv-side">
          <span className="fl-conv-label">You pay</span>
          <span className="fl-conv-amt">{eur(pay.val)}</span>
          <span className="fl-conv-sub">{fmtNum(pay.amt, 4)} {pay.coin.sym}</span>
        </div>
        <button className="fl-conv-swap" onClick={() => setSwapped((s) => !s)}>{Ico.swap("#fff", 20)}</button>
        <div className="fl-conv-side" style={{ textAlign: "right" }}>
          <span className="fl-conv-label">You receive</span>
          <span className="fl-conv-amt">{eur(rec.val)}</span>
          <span className="fl-conv-sub">{fmtNum(rec.amt, 4)} {rec.coin.sym}</span>
        </div>
      </div>

      {/* AUTHORED: Convert CTA — the convert flow lands in phase 4b. TODO(4b)
          flexShrink:0: see the primary CTA above — pin 54px against column shrink. */}
      <button className="fl-primary ghost" style={{ marginTop: 12, flexShrink: 0 }} disabled>
        Convert — coming soon
      </button>
    </PhoneFrame>
  );
}
