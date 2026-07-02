"use client";
// app/buy/page.tsx — Buy step 1 (Amount), ported from buyflow.jsx ScreenBuyAmount.
// The numpad drives local input; Continue commits the EUR amount to the store
// (which derives the BTC equivalent) and advances to /buy/payment.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum } from "@/lib/flux-data";
import { useBuy } from "@/lib/store";

const BTC = FLUX.coins.btc;
const fmtAmt = (str: string) => {
  const [i, d] = String(str).split(".");
  const gi = (i || "0").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return d !== undefined ? gi + "," + d : gi;
};

export default function BuyAmountPage() {
  const router = useRouter();
  const { setBuyAmount } = useBuy();
  const [amt, setAmt] = React.useState("100");
  const [unit, setUnit] = React.useState<"eur" | "btc">("eur");
  const eurVal = parseFloat(amt || "0") || 0;
  const btcVal = eurVal / BTC.price;

  const press = (k: string) =>
    setAmt((cur) => {
      if (k === "del") return cur.length <= 1 ? "0" : cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : cur + ".";
      if (cur === "0") return k;
      return (cur + k).slice(0, 9);
    });
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

  const cont = () => {
    setBuyAmount(eurVal);
    router.push("/buy/payment");
  };

  const footer = (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" style={{ width: "100%" }} onClick={cont}>Continue</button>
    </div>
  );

  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.push("/coin/btc")}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Buy</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <button className="fl-coinchip"><CoinAvatar id="btc" size={24} /><span>Bitcoin</span>{Ico.chevD("rgba(255,255,255,0.55)", 16)}</button>
      </div>

      <div className="fl-amount-mid">
        <div className="fl-amount-display">
          {unit === "eur" ? (
            <span className="fl-bal-amt" style={{ fontSize: 50 }}>{fmtAmt(amt)}<span className="fl-bal-cur">€</span></span>
          ) : (
            <span className="fl-bal-amt" style={{ fontSize: 44 }}>{fmtNum(btcVal, 6)}<span className="fl-bal-cur">BTC</span></span>
          )}
        </div>
        <div className="fl-unittog">
          <button className={unit === "eur" ? "on" : ""} onClick={() => setUnit("eur")}>EUR</button>
          <button className={unit === "btc" ? "on" : ""} onClick={() => setUnit("btc")}>BTC</button>
        </div>
        <div className="fl-receive">≈ {fmtNum(btcVal, 6)} BTC · {eur(eurVal)} </div>
      </div>

      <div className="fl-quick">
        {["50", "100", "250"].map((q) => (
          <button key={q} className={"fl-quickchip" + (amt === q ? " on" : "")} onClick={() => setAmt(q)}>{q} €</button>
        ))}
      </div>

      <div className="fl-numpad">
        {keys.map((k) => (
          <button key={k} className="fl-key" onClick={() => press(k)}>
            {k === "del" ? Ico.backspace("rgba(255,255,255,0.85)", 24) : k}
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}
