"use client";
// app/buy/success/page.tsx — Buy step 4 (Success), ported from buyflow.jsx
// ScreenBuySuccess. The source hardcoded `eurVal = 100`; here the purchased
// amount, BTC total and fee come from the store's pendingBuy. In 2a both footer
// buttons go to /home (Wallet doesn't exist yet). If the store is empty (hard
// reload), fall back to /home.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";
import { eur, fmtNum } from "@/lib/flux-data";
import { useBuy } from "@/lib/store";

export default function BuySuccessPage() {
  const router = useRouter();
  const { pendingBuy } = useBuy();

  React.useEffect(() => {
    if (!pendingBuy) router.replace("/home");
  }, [pendingBuy, router]);
  if (!pendingBuy) return null;

  const { eurAmount, cryptoAmount, feeEur } = pendingBuy;

  const footer = (
    <div className="fl-ctabar col">
      {/* TODO(2b): re-point "View in wallet" → /wallet once the Wallet screen exists. */}
      <button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/home")}>View in wallet</button>
      <button className="fl-done-link" onClick={() => router.push("/home")}>Done</button>
    </div>
  );

  return (
    <PhoneFrame footer={footer}>
      <div className="fl-success-wrap">
        <div className="fl-success-badge">
          <div className="fl-sring" style={{ width: 150, height: 150 }} />
          <div className="fl-sring" style={{ width: 118, height: 118, animationDelay: ".5s" }} />
          {Ico.check("#fff", 46)}
        </div>
        <h2 className="fl-success-title">Purchase complete</h2>
        <p className="fl-success-sub">You&apos;ve added Bitcoin to your wallet.</p>
        <div className="fl-success-amt">
          <span className="fl-bal-amt" style={{ fontSize: 34 }}>{fmtNum(cryptoAmount, 6)}<span className="fl-bal-cur">BTC</span></span>
          <span style={{ fontSize: 14, color: "#8A91A3", marginTop: 4 }}>{eur(eurAmount + feeEur)} paid</span>
        </div>
      </div>
    </PhoneFrame>
  );
}
