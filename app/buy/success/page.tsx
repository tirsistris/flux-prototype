"use client";
// app/buy/success/page.tsx — Buy step 4 (Success), ported from buyflow.jsx
// ScreenBuySuccess. The purchased amount, BTC total and fee come from the store's
// pendingBuy — snapshotted on mount, after which pendingBuy is CLEARED so that
// navigating back to /buy/confirm can't re-inject the same transaction (confirm's
// guard bounces the now-empty store to /buy). [View in wallet] → /wallet,
// [Done] → /home. If the store is already empty (hard reload), fall back to /home.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";
import { eur, fmtCrypto } from "@/lib/flux-data";
import { useBuy } from "@/lib/store";

export default function BuySuccessPage() {
  const router = useRouter();
  const { pendingBuy, clearPendingBuy } = useBuy();
  // Capture pendingBuy at mount so the screen keeps rendering after we clear it.
  const [snap] = React.useState(() => pendingBuy);

  React.useEffect(() => {
    // The transaction was already injected on Confirm; drop the pending buy so a
    // back-navigation + second Confirm can't double it.
    clearPendingBuy();
  }, [clearPendingBuy]);

  React.useEffect(() => {
    if (!snap) router.replace("/home");
  }, [snap, router]);
  if (!snap) return null;

  const { eurAmount, cryptoAmount, feeEur } = snap;

  const footer = (
    <div className="fl-ctabar col">
      {/* flex:none neutralises the shared .fl-cta-buy `flex:1`, whose 0% basis
          collapses the button's height inside this column footer (.fl-ctabar.col);
          restores the standard 54px primary height. width:100% keeps full width. */}
      <button className="fl-cta-buy" style={{ width: "100%", flex: "none" }} onClick={() => router.push("/wallet")}>View in wallet</button>
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
          <span className="fl-bal-amt" style={{ fontSize: 34 }}>{fmtCrypto(cryptoAmount)}<span className="fl-bal-cur">BTC</span></span>
          <span style={{ fontSize: 14, color: "#8A91A3", marginTop: 4 }}>{eur(eurAmount + feeEur)} paid</span>
        </div>
      </div>
    </PhoneFrame>
  );
}
