"use client";
// app/send/success/page.tsx — Send step 4 (Success), ported from ScreenSendSuccess.
// Column footer (.fl-ctabar col): [View in wallet] keeps its 54px height via the
// phase-4a systemic fix (flex:1 is scoped to .fl-ctabar:not(.col) row footers), so
// NO inline flex patch is needed here. View → /wallet, Done → /home. No transaction
// is injected into the wallet — Send is a static demo off the golden path. The
// explorer chip is an inert demo control (its tx hash is a placeholder).
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";
import { fmtNum } from "@/lib/flux-data";

export default function SendSuccessPage() {
  const router = useRouter();
  const amt = 1.5;
  const footer = (
    <div className="fl-ctabar col">
      <button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push("/wallet")}>View in wallet</button>
      <button className="fl-done-link" onClick={() => router.push("/home")}>Done</button>
    </div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-success-wrap">
        <div className="fl-success-badge">
          <div className="fl-sring" style={{ width: 150, height: 150 }} />
          <div className="fl-sring" style={{ width: 118, height: 118, animationDelay: ".5s" }} />
          {Ico.check("#fff", 44)}
        </div>
        <h2 className="fl-success-title">Sent</h2>
        <p className="fl-success-sub">Your transfer is on its way.</p>
        <div className="fl-success-amt">
          <span className="fl-bal-amt" style={{ fontSize: 32 }}>{fmtNum(amt, 4)}<span className="fl-bal-cur">ETH</span></span>
          <span style={{ fontSize: 13.5, color: "#8A91A3", marginTop: 4 }}>to 0x1a2…f9c</span>
        </div>
        <button className="fl-explorer">0x9f2c…7b3e {Ico.external("#8A79FF", 16)}<span>View on explorer</span></button>
      </div>
    </PhoneFrame>
  );
}
