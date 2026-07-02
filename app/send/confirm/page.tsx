"use client";
// app/send/confirm/page.tsx — Send step 3 (Confirm), ported from ScreenSendConfirm.
// Static demo: the amount (1.5 ETH) and fee (0.0009) are source constants — the
// flow does NOT carry the Amount screen's numpad value (faithful to the export, and
// fine off the golden path). The To-address is a consistent demo placeholder, the
// same one shown on Success. [Confirm] → /send/success.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum } from "@/lib/flux-data";

const ETH = FLUX.coins.eth;

function SSumRow({ label, value, total }: { label: string; value: string; total?: boolean }) {
  return (
    <div className={"fl-sum-row" + (total ? " total" : "")}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-sum-val">{value}</span>
    </div>
  );
}

export default function SendConfirmPage() {
  const router = useRouter();
  const amt = 1.5,
    fee = 0.0009;
  const eurVal = amt * ETH.price;

  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/send/success")}>Confirm</button></div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("rgba(255,255,255,0.85)", 20)}</button>
        <span className="fl-flow-title">Confirm</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-card fl-confirm-hero">
        <CoinAvatar id="eth" size={48} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
          <span className="fl-bal-amt" style={{ fontSize: 30 }}>{fmtNum(amt, 4)}<span className="fl-bal-cur">ETH</span></span>
          <span style={{ fontSize: 13.5, color: "#8A91A3" }}>≈ {eur(eurVal)}</span>
        </div>
      </div>

      <div className="fl-summary">
        <SSumRow label="To" value="0x1a2…f9c" />
        <SSumRow label="Network" value="Ethereum" />
        <SSumRow label="Network fee" value={`${fmtNum(fee, 4)} ETH · ${eur(fee * ETH.price)}`} />
        <SSumRow label="Total" value={`${fmtNum(amt + fee, 4)} ETH`} total />
      </div>

      <div className="fl-warn">
        {Ico.shield("#F87171", 18)}
        <span>Crypto transfers are irreversible. Double-check the address before you confirm.</span>
      </div>
    </PhoneFrame>
  );
}
