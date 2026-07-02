"use client";
// app/send/amount/page.tsx — Send step 2 (Amount), ported from ScreenSendAmount.
// ETH; the numpad drives local state (default 1.5, like the source). "Available
// 6.4 ETH" + [Max] are source demo constants — there is no real balance model and
// no fake validation (any amount continues). [Continue] → /send/confirm.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum } from "@/lib/flux-data";

const ETH = FLUX.coins.eth;
const sFmtAmt = (str: string) => {
  const [i, d] = String(str).split(".");
  const gi = (i || "0").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return d !== undefined ? gi + "," + d : gi;
};

export default function SendAmountPage() {
  const router = useRouter();
  const [amt, setAmt] = React.useState("1.5");
  const avail = 6.4;
  const eurVal = (parseFloat(amt || "0") || 0) * ETH.price;
  const press = (k: string) =>
    setAmt((cur) => {
      if (k === "del") return cur.length <= 1 ? "0" : cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : cur + ".";
      if (cur === "0") return k;
      return (cur + k).slice(0, 9);
    });
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/send/confirm")}>Continue</button></div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Send</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <button className="fl-coinchip"><CoinAvatar id="eth" size={24} /><span>Ethereum</span>{Ico.chevD("rgba(255,255,255,0.55)", 16)}</button>
      </div>

      <div className="fl-amount-mid">
        <div className="fl-amount-display">
          <span className="fl-bal-amt" style={{ fontSize: 46 }}>{sFmtAmt(amt)}<span className="fl-bal-cur">ETH</span></span>
        </div>
        <div className="fl-receive">≈ {eur(eurVal)}</div>
      </div>

      <div className="fl-avail-row">
        <span>Available <b style={{ color: "#fff", fontWeight: 600 }}>{fmtNum(avail, 4)} ETH</b></span>
        <button className="fl-max-btn" onClick={() => setAmt(String(avail))}>Max</button>
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
