"use client";
// app/earn/[id]/amount/page.tsx — Earn amount entry, ported from stakeflow.jsx
// ScreenStakeAmount, parametrized by coin. APY is FLUX.earn[id].apy (real), not
// the source's hardcoded 4.20.
//
// "Available" is an AUTHORED demo constant — there is no "funds available to
// stake" figure in the data model. It is NOT FLUX.balance: that is total
// portfolio value (a different, already-invested figure), and substituting it
// here would misrepresent it as spare cash. Same precedent as /send/amount's
// "Available 6.4 ETH".
//
// The "≈ N SYM" crypto-equivalent line needs a live price and is skipped for
// coins without one in FLUX.coins (usdc) — the € input and the €-denominated
// yearly forecast both still work with no price, so the screen stays complete
// rather than breaking on an undefined price.
//
// No store: static demo off the golden path, same as Send. The source export
// has no screen past this one (no confirm/success), so [Confirm] stays an
// honest inert control rather than a dead link to a page that doesn't exist.
import React from "react";
import { useRouter, notFound } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum, GROWTH } from "@/lib/flux-data";

const AVAIL_EUR = 22743.6; // AUTHORED demo constant — see file header

export default function StakeAmountPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id.toLowerCase();
  const e = FLUX.earn.find((x) => x.coin === id);
  if (!e) return notFound();
  const c = FLUX.coins[id]; // undefined for usdc — no price to convert against
  const sym = c?.sym ?? e.sym ?? id.toUpperCase();

  const [amt, setAmt] = React.useState("500");
  const eurVal = parseFloat(amt || "0") || 0;
  const coinVal = c ? eurVal / c.price : null;
  const yearEarn = (eurVal * e.apy) / 100;
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

  const footer = (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" style={{ width: "100%", opacity: 0.5, cursor: "default" }} disabled>Confirm</button>
    </div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Stake {sym}</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-amount-mid" style={{ gap: 14 }}>
        <div className="fl-amount-display">
          <span className="fl-bal-amt" style={{ fontSize: 50 }}>{fmtAmt(amt)}<span className="fl-bal-cur">€</span></span>
        </div>
        {coinVal !== null && <div className="fl-receive">≈ {fmtNum(coinVal, 4)} {sym}</div>}
        <div className="fl-stake-forecast">
          {Ico.tabMarkets(GROWTH, 18)}
          <span>≈ <b style={{ color: GROWTH }}>{eur(yearEarn)}</b> a year at {fmtNum(e.apy, 2)} % APY</span>
        </div>
      </div>

      <div className="fl-avail-row">
        <span>Available <b style={{ color: "#fff", fontWeight: 600 }}>{eur(AVAIL_EUR)}</b></span>
        <button className="fl-max-btn" onClick={() => setAmt(String(Math.floor(AVAIL_EUR)))}>Max</button>
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
