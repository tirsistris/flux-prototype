"use client";
// app/coin/[id]/page.tsx — Coin detail, parametrized (phase 4a; supersedes the
// old hardcoded /coin/btc route so there is one source of truth for the screen).
// Header + price + change + chart render for every known coin. The stats grid,
// "Your balance" and About sections render ONLY when the coin has modelled detail
// data in COIN_DETAIL — for coins without it we invent nothing (no "0 ETH", no
// placeholder cap/vol/high/low, no About). The chart label is derived from the
// live price. Buy → /buy; Sell stays an honest inert control.
import React from "react";
import { useRouter, notFound } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { AreaChart, CoinAvatar, BalAmt } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, COIN_DETAIL, eur, pct, signEur, fmtNum, chColor } from "@/lib/flux-data";

function Stat2({ label, value }: { label: string; value: string }) {
  return (
    <div className="fl-stat2">
      <span className="fl-stat2-label">{label}</span>
      <span className="fl-stat2-val">{value}</span>
    </div>
  );
}

export default function CoinPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id.toLowerCase();
  const [star, setStar] = React.useState(true);

  const c = FLUX.coins[id];
  if (!c) return notFound();

  const detail = COIN_DETAIL[id]; // undefined for coins we don't model in depth
  const dayAbs = c.price - c.price / (1 + c.ch / 100);
  // Chart tooltip sits on the synthetic peak; label a recent-high derived from the
  // live price (~2% under spot) so it stays consistent per coin without a hardcode.
  const chartLabel = eur(c.price * 0.9784);

  const holdVal = detail ? detail.holdAmt * c.price : 0;
  const holdDay = holdVal - holdVal / (1 + c.ch / 100);

  const footer = (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" onClick={() => router.push("/buy")}>{Ico.receive("#fff", 19)}Buy</button>
      <button className="fl-cta-sell">{Ico.send("#fff", 19)}Sell</button>
    </div>
  );

  return (
    <PhoneFrame scroll footer={footer}>
      <div className="fl-detail-head">
        {/* chevron 16px to match Wallet/Trade .fl-roundbtn.sm headers (same 34px plaque → same glyph size). */}
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("rgba(255,255,255,0.85)", 16)}</button>
        <div className="fl-detail-coin">
          <CoinAvatar id={id} size={28} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{c.name}</span>
            <span style={{ fontSize: 11.5, color: "#8A91A3" }}>{c.sym}</span>
          </div>
        </div>
        <button className={"fl-star" + (star ? " on" : "")} onClick={() => setStar((s) => !s)}>
          {Ico.star(star ? "#8A79FF" : "rgba(255,255,255,0.65)", 19, star)}
        </button>
      </div>

      <div className="fl-detail-price">
        <BalAmt n={c.price} />
        <div className="fl-bal-change" style={{ color: chColor(c.ch), marginTop: 6 }}>{signEur(dayAbs)} ({pct(c.ch)})</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <AreaChart vals={FLUX.curve} w={342} h={140} label={chartLabel} id="coin" />
      </div>

      {detail && (
        <>
          <div className="fl-stat2-grid" style={{ marginTop: 20 }}>
            <Stat2 label="Market cap" value={detail.marketCap} />
            <Stat2 label="24h Volume" value={detail.volume} />
            <Stat2 label="24h High" value={eur(detail.high)} />
            <Stat2 label="24h Low" value={eur(detail.low)} />
          </div>

          <div className="fl-sec-head" style={{ marginTop: 22, marginBottom: 10 }}>
            <span className="fl-sec-title">Your balance</span>
          </div>
          <div className="fl-card fl-holding">
            <CoinAvatar id={id} size={42} />
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>Your {c.name}</span>
              <span style={{ fontSize: 12.5, color: "#8A91A3" }}>{fmtNum(detail.holdAmt, 4)} {c.sym}</span>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{eur(holdVal)}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(holdDay) }}>{signEur(holdDay)} today</span>
            </div>
          </div>

          <div className="fl-sec-head" style={{ marginTop: 22, marginBottom: 10 }}>
            <span className="fl-sec-title">About {c.name}</span>
          </div>
          <p className="fl-about-text">
            {detail.about} <span className="fl-about-link">Read more</span>
          </p>
        </>
      )}
    </PhoneFrame>
  );
}
