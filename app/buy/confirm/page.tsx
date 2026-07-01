"use client";
// app/buy/confirm/page.tsx — Buy step 3 (Confirm), ported from buyflow.jsx
// ScreenBuyConfirm. The source hardcoded `eurVal = 100, fee = 1.49`; here the
// amount, BTC equivalent, fee and pay-method all come from the store's
// pendingBuy. Confirm purchase → /buy/success (no tx creation until 2b).
// If the store is empty (e.g. a hard reload dropped it), fall back to /buy.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum } from "@/lib/flux-data";
import { useBuy, type BuyMethod } from "@/lib/store";

const BTC = FLUX.coins.btc;

function SumRow({ label, value, total }: { label: string; value: string; total?: boolean }) {
  return (
    <div className={"fl-sum-row" + (total ? " total" : "")}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-sum-val">{value}</span>
    </div>
  );
}

const PAY_LABEL: Record<BuyMethod, string> = {
  card: "Visa •••• 4242",
  bank: "Bank •••• 8821",
  apple: "Apple Pay",
};

export default function BuyConfirmPage() {
  const router = useRouter();
  const { pendingBuy } = useBuy();

  React.useEffect(() => {
    if (!pendingBuy) router.replace("/buy");
  }, [pendingBuy, router]);
  if (!pendingBuy) return null;

  const { eurAmount, cryptoAmount, feeEur, method } = pendingBuy;

  const footer = (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/buy/success")}>Confirm purchase</button>
    </div>
  );

  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.push("/buy/payment")}>{Ico.chevL("rgba(255,255,255,0.85)", 20)}</button>
        <span className="fl-flow-title">Confirm</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-card fl-confirm-hero">
        <CoinAvatar id="btc" size={48} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
          <span className="fl-bal-amt" style={{ fontSize: 30 }}>{fmtNum(cryptoAmount, 6)}<span className="fl-bal-cur">BTC</span></span>
          <span style={{ fontSize: 13.5, color: "#8A91A3" }}>≈ for {eur(eurAmount)}</span>
        </div>
      </div>

      <div className="fl-summary">
        <SumRow label="Pay with" value={PAY_LABEL[method]} />
        <SumRow label="Price" value={`${eur(BTC.price)} / BTC`} />
        <SumRow label="Fee" value={eur(feeEur)} />
        <SumRow label="Total" value={eur(eurAmount + feeEur)} total />
      </div>

      <p className="fl-disclaimer">
        Crypto prices can move quickly. The final amount of BTC you receive may differ
        slightly from the estimate shown above.
      </p>
    </PhoneFrame>
  );
}
