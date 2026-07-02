"use client";
// app/buy/payment/page.tsx — Buy step 2 (Payment), ported from buyflow.jsx
// ScreenBuyPayment. Continue writes the chosen method to the store and advances
// to /buy/confirm. Selection seeds from the store so going back preserves it.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";
import { useBuy, type BuyMethod } from "@/lib/store";

const METHODS: { id: BuyMethod; label: string; sub: string; ico: (typeof Ico)[string] }[] = [
  { id: "card", label: "Visa card", sub: "•••• 4242", ico: Ico.card },
  { id: "bank", label: "Bank account", sub: "IBAN •••• 8821", ico: Ico.bank },
  { id: "apple", label: "Apple Pay", sub: "Default", ico: Ico.apple },
];

export default function BuyPaymentPage() {
  const router = useRouter();
  const { pendingBuy, setBuyMethod } = useBuy();
  const [sel, setSel] = React.useState<BuyMethod>(pendingBuy?.method ?? "card");

  const cont = () => {
    setBuyMethod(sel);
    router.push("/buy/confirm");
  };

  const footer = (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" style={{ width: "100%" }} onClick={cont}>Continue</button>
    </div>
  );

  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.push("/buy")}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Payment</span>
        <div style={{ width: 34 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <h2 className="fl-flow-h2">How would you like to pay?</h2>
        <p className="fl-flow-sub">Choose a payment method for this purchase.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {METHODS.map((m) => (
          <button key={m.id} className={"fl-card fl-pay-row" + (sel === m.id ? " on" : "")} onClick={() => setSel(m.id)}>
            <span className="fl-pay-ico">{m.ico("#fff", 22)}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{m.label}</span>
              <span style={{ fontSize: 12.5, color: "#8A91A3" }}>{m.sub}</span>
            </div>
            <div className={"fl-radio" + (sel === m.id ? " on" : "")}>{sel === m.id && <div className="fl-radio-dot" />}</div>
          </button>
        ))}
      </div>
      <button className="fl-addmethod">+ Add a new method</button>
    </PhoneFrame>
  );
}
