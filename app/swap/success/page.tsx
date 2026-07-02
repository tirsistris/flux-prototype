"use client";
// app/swap/success/page.tsx — Swap Success, ported from swapflow.jsx ScreenSwapSuccess.
// Column footer (.fl-ctabar col): [View in wallet] keeps its 54px height via the
// phase-4a systemic fix — no inline flex patch. View → /wallet, Done → /home.
// Static BTC→ETH demo; no store, no tx injection. See /swap/confirm for the
// AUTHORED boundary note.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, fmtNum } from "@/lib/flux-data";

const SB = FLUX.coins.btc,
  SE = FLUX.coins.eth;
const PAY_BTC = 0.1;
const PAY_VAL = PAY_BTC * SB.price;
const REC_VAL = PAY_VAL * (1 - 0.0024);
const REC_ETH = REC_VAL / SE.price;

export default function SwapSuccessPage() {
  const router = useRouter();
  const footer = (
    <div className="fl-ctabar col">
      <button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/wallet")}>View in wallet</button>
      <button className="fl-done-link" onClick={() => router.push("/home")}>Done</button>
    </div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-success-wrap">
        <div className="fl-success-badge">
          <div className="fl-sring" style={{ width: 150, height: 150 }} />
          <div className="fl-sring" style={{ width: 118, height: 118, animationDelay: ".5s" }} />
          {Ico.check("#fff", 44)}
        </div>
        <h2 className="fl-success-title">Swap complete</h2>
        <p className="fl-success-sub">Your coins have been exchanged.</p>
        <div className="fl-swap-result">
          <div className="fl-swap-res-leg">
            <CoinAvatar id="btc" size={34} />
            <span>{fmtNum(PAY_BTC, 4)} BTC</span>
          </div>
          <span className="fl-swap-res-arrow">{Ico.arrowR("#8A79FF", 22)}</span>
          <div className="fl-swap-res-leg">
            <CoinAvatar id="eth" size={34} />
            <span>{fmtNum(REC_ETH, 4)} ETH</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
