"use client";
// app/settings/kyc/page.tsx — Personal data / KYC, ported from settingsflow.jsx
// ScreenKYC. Fields are display-only (value or placeholder), matching the
// source exactly — no editable inputs pretending to save changes that go
// nowhere. Status fixed to "Pending" (the source's own default; there's no
// verification backend to actually flip it to Verified). [Complete
// verification] is honestly disabled — it would hand off to a real KYC
// provider, which doesn't exist here.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";
import { FLUX, GROWTH } from "@/lib/flux-data";

function Field({ label, value, placeholder, icon }: { label: string; value?: string; placeholder?: string; icon?: React.ReactNode }) {
  return (
    <div className="fl-field">
      <span className="fl-field-label">{label}</span>
      <div className="fl-field-box">
        {value ? <span className="fl-field-val">{value}</span> : <span className="fl-field-ph">{placeholder}</span>}
        {icon && <span style={{ marginLeft: "auto", display: "flex" }}>{icon}</span>}
      </div>
    </div>
  );
}

export default function KycPage() {
  const router = useRouter();
  const verified = false; // status is fixed Pending — no verification backend exists

  const footer = verified ? (
    <div style={{ height: 12 }} />
  ) : (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" style={{ width: "100%", opacity: 0.5, cursor: "default" }} disabled>Complete verification</button>
    </div>
  );
  return (
    <PhoneFrame footer={footer} scroll>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()} aria-label="Back">{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Personal data</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-kyc-status">
        <div className="fl-avatar lg">{Ico.user("rgba(255,255,255,0.85)", 30)}</div>
        <div className={"fl-kyc-pill" + (verified ? " ok" : " pending")}>
          {verified ? Ico.check(GROWTH, 14) : Ico.shield("#F8C66B", 14)}
          <span>{verified ? "Verified" : "Verification pending"}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        <Field label="Full name" value={FLUX.user.name} icon={Ico.edit("rgba(255,255,255,0.4)", 17)} />
        <Field label="Email" value={FLUX.user.email} icon={Ico.edit("rgba(255,255,255,0.4)", 17)} />
        <Field label="Phone" value="+381 64 123 45 67" icon={Ico.edit("rgba(255,255,255,0.4)", 17)} />
        <Field label="Country" value="Serbia" icon={Ico.chevD("rgba(255,255,255,0.4)", 17)} />
      </div>

      {!verified && (
        <div className="fl-warn" style={{ marginTop: 18, color: "#E6C58C", background: "rgba(248,198,107,0.08)", borderColor: "rgba(248,198,107,0.2)" }}>
          {Ico.shield("#F8C66B", 18)}
          <span>Finish identity verification to lift limits and unlock withdrawals.</span>
        </div>
      )}
    </PhoneFrame>
  );
}
