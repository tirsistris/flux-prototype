"use client";
// app/alerts/new/page.tsx — Create price alert, ported from notifyflow.jsx
// ScreenPriceAlert. Coin is fixed to BTC throughout (matches the source — no
// coin picker). Above/Below toggle, numpad target, and the push switch are all
// live local state; delta is computed from the real FLUX.coins.btc price.
//
// [Create alert] → the source export has no screen past this one (no success
// state to port). A brief real-action toast ("Alert created") confirms the tap
// did something, then returns to /notifications — honest because it claims
// nothing beyond "you did this just now" (no fake persistence/backend claim).
// No store: this alert isn't saved anywhere and won't appear in the
// Notifications feed on return, same as Send/Earn's static-demo precedent.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, pct, GROWTH, FALL } from "@/lib/flux-data";

export default function NewPriceAlertPage() {
  const router = useRouter();
  const coin = FLUX.coins.btc;
  const [cond, setCond] = React.useState<"Above" | "Below">("Above");
  const [amt, setAmt] = React.useState("110000");
  const [push, setPush] = React.useState(true);
  const [created, setCreated] = React.useState(false);
  const target = parseFloat(amt || "0") || 0;
  const delta = ((target - coin.price) / coin.price) * 100;

  const press = (k: string) =>
    setAmt((cur) => {
      if (k === "del") return cur.length <= 1 ? "0" : cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : cur + ".";
      if (cur === "0") return k;
      return (cur + k).slice(0, 9);
    });
  const fmtAmt = (str: string) => {
    const [i, d] = String(str).split(".");
    const gi = (i || "0").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return d !== undefined ? gi + "," + d : gi;
  };
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

  const create = () => {
    setCreated(true);
    setTimeout(() => router.back(), 900);
  };

  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: "100%" }} onClick={create}>Create alert</button></div>
  );
  return (
    <PhoneFrame footer={footer}>
      {created && <div className="fl-toast">{Ico.check(GROWTH, 16)}Alert created</div>}
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">New price alert</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <button className="fl-coinchip"><CoinAvatar id="btc" size={24} /><span>Bitcoin</span>{Ico.chevD("rgba(255,255,255,0.55)", 16)}</button>
      </div>

      <div className="fl-cond-tog">
        <button className={cond === "Above" ? "on" : ""} onClick={() => setCond("Above")}>{Ico.tabMarkets(cond === "Above" ? "#fff" : "rgba(255,255,255,0.6)", 17)}Above</button>
        <button className={cond === "Below" ? "on" : ""} onClick={() => setCond("Below")}><span style={{ transform: "rotate(90deg)", display: "flex" }}>{Ico.tabMarkets(cond === "Below" ? "#fff" : "rgba(255,255,255,0.6)", 17)}</span>Below</button>
      </div>

      <div className="fl-amount-mid" style={{ flex: "0 0 auto", margin: "18px 0", gap: 8 }}>
        <span className="fl-alert-cap">Notify me when BTC goes {cond.toLowerCase()}</span>
        <div className="fl-amount-display"><span className="fl-bal-amt" style={{ fontSize: 46 }}>{fmtAmt(amt)}<span className="fl-bal-cur">€</span></span></div>
        <div className="fl-receive">Now {eur(coin.price)} · <span style={{ color: delta >= 0 ? GROWTH : FALL }}>{pct(delta)}</span> away</div>
      </div>

      <button className="fl-pushrow" onClick={() => setPush((p) => !p)}>
        <span className="fl-pay-ico" style={{ width: 38, height: 38 }}>{Ico.bell("#fff", 19)}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
          <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>Push notification</span>
          <span style={{ fontSize: 12.5, color: "#8A91A3" }}>Alert me on this device</span>
        </div>
        <div className={"fl-switch" + (push ? " on" : "")}><div className="fl-switch-knob" /></div>
      </button>

      <div className="fl-numpad" style={{ marginTop: "auto" }}>
        {keys.map((k) => (
          <button key={k} className="fl-key" onClick={() => press(k)}>
            {k === "del" ? Ico.backspace("rgba(255,255,255,0.85)", 24) : k}
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}
