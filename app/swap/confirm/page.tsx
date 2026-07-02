"use client";
// app/swap/confirm/page.tsx — Swap Confirm, ported from swapflow.jsx ScreenSwapConfirm.
//
// AUTHORED boundary: /swap/confirm shows a STATIC BTC→ETH pair regardless of entry
// point. The pair/amount selector is NOT implemented here — it lived on the Trade
// converter and is activated in phase 4b-2. This is a demo confirmation, not a full
// swap. Pay/receive/rate/spread are derived from FLUX prices; the network fee is a
// demo constant. [Confirm swap] → /swap/success.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum } from "@/lib/flux-data";

const SB = FLUX.coins.btc,
  SE = FLUX.coins.eth;
const PAY_BTC = 0.1;
const PAY_VAL = PAY_BTC * SB.price;
const REC_VAL = PAY_VAL * (1 - 0.0024); // 0,24% spread
const REC_ETH = REC_VAL / SE.price;
const RATE = SB.price / SE.price;

function SwapPair({ big }: { big?: boolean }) {
  return (
    <div className={"fl-swap-pair" + (big ? " big" : "")}>
      <div className="fl-swap-leg">
        <CoinAvatar id="btc" size={big ? 44 : 38} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="fl-swap-amt">{fmtNum(PAY_BTC, 4)} BTC</span>
          <span className="fl-swap-sub">From · {eur(PAY_VAL)}</span>
        </div>
      </div>
      <div className="fl-swap-arrow">{Ico.swapV("#fff", 20)}</div>
      <div className="fl-swap-leg">
        <CoinAvatar id="eth" size={big ? 44 : 38} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="fl-swap-amt">{fmtNum(REC_ETH, 4)} ETH</span>
          <span className="fl-swap-sub">To · {eur(REC_VAL)}</span>
        </div>
      </div>
    </div>
  );
}

function SwSumRow({ label, value, total }: { label: string; value: string; total?: boolean }) {
  return (
    <div className={"fl-sum-row" + (total ? " total" : "")}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-sum-val">{value}</span>
    </div>
  );
}

export default function SwapConfirmPage() {
  const router = useRouter();
  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/swap/success")}>Confirm swap</button></div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("rgba(255,255,255,0.85)", 20)}</button>
        <span className="fl-flow-title">Confirm swap</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-card fl-swap-hero">
        <SwapPair big />
      </div>

      <div className="fl-summary">
        <SwSumRow label="Rate" value={`1 BTC = ${fmtNum(RATE, 4)} ETH`} />
        <SwSumRow label="Spread (0,24 %)" value={eur(PAY_VAL - REC_VAL)} />
        <SwSumRow label="Network fee" value={eur(1.9)} />
        <SwSumRow label="You receive" value={`${fmtNum(REC_ETH, 4)} ETH`} total />
      </div>

      <p className="fl-disclaimer">
        Crypto prices can move quickly. The amount of ETH you receive may differ slightly
        from the estimate shown above.
      </p>
    </PhoneFrame>
  );
}
