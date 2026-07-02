"use client";
// app/send/page.tsx — Send step 1 (Recipient), ported from sendflow.jsx
// ScreenSendRecipient. Send is ETH throughout (source hardcode). The address field
// is a display placeholder (the source has no real text input); [Continue] and
// tapping any Recent both advance to /send/amount. Scan → /send/scan. Send is a
// static demo flow off the golden path — no store, no tx injection.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";

// Demo recipients — placeholder names + truncated addresses (not real wallets).
const RECENTS = [
  { name: "Hardware wallet", addr: "0x7d3…a14", hue: 262 },
  { name: "Anna", addr: "0x4f9…2ab", hue: 205 },
  { name: "Saved address", addr: "0x88c…d10", hue: 150 },
];

function Ident({ hue }: { hue: number }) {
  return <div className="fl-ident" style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue + 40} 65% 48%))` }} />;
}

export default function SendRecipientPage() {
  const router = useRouter();
  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/send/amount")}>Continue</button></div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("rgba(255,255,255,0.85)", 20)}</button>
        <span className="fl-flow-title">Send</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ marginTop: 8 }}>
        <h2 className="fl-flow-h2">Send to</h2>
        <p className="fl-flow-sub">Paste, type or scan a wallet address.</p>
      </div>

      <div className="fl-addr-field">
        <span className="fl-addr-placeholder">Address or ENS name</span>
        <button className="fl-addr-scan" onClick={() => router.push("/send/scan")}>{Ico.camera("#fff", 21)}</button>
      </div>

      <div className="fl-net-row">
        <span className="fl-flow-sub" style={{ margin: 0 }}>Network</span>
        <button className="fl-coinchip" style={{ padding: "6px 11px 6px 6px" }}><CoinAvatar id="eth" size={22} /><span>Ethereum</span>{Ico.chevD("rgba(255,255,255,0.55)", 15)}</button>
      </div>

      <div className="fl-sec-head" style={{ marginTop: 18, marginBottom: 8 }}><span className="fl-sec-title">Recent</span></div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {RECENTS.map((r, i) => (
          <button key={i} className="fl-recent-row" onClick={() => router.push("/send/amount")}>
            <Ident hue={r.hue} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>{r.name}</span>
              <span style={{ fontSize: 12.5, color: "#8A91A3", fontVariantNumeric: "tabular-nums" }}>{r.addr}</span>
            </div>
            <span style={{ marginLeft: "auto", display: "flex" }}>{Ico.chevR("rgba(255,255,255,0.3)", 18)}</span>
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}
