"use client";
// app/settings/add-bank/page.tsx — Add bank account, ported from
// settingsflow.jsx ScreenAddBank. Fields are display-only placeholders, matching
// the source exactly — no editable inputs that would imply a working form with
// validation that doesn't exist. [Add account] is honestly disabled — linking a
// real bank account needs a real banking backend, which doesn't exist here.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";

function Field({ label, placeholder, icon }: { label: string; placeholder: string; icon?: React.ReactNode }) {
  return (
    <div className="fl-field">
      <span className="fl-field-label">{label}</span>
      <div className="fl-field-box">
        <span className="fl-field-ph">{placeholder}</span>
        {icon && <span style={{ marginLeft: "auto", display: "flex" }}>{icon}</span>}
      </div>
    </div>
  );
}

export default function AddBankPage() {
  const router = useRouter();
  const footer = (
    <div className="fl-ctabar">
      <button className="fl-cta-buy" style={{ width: "100%", opacity: 0.5, cursor: "default" }} disabled>Add account</button>
    </div>
  );
  return (
    <PhoneFrame footer={footer} scroll>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()} aria-label="Back">{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Add bank account</span>
        <div style={{ width: 34 }} />
      </div>
      <p className="fl-flow-sub" style={{ marginTop: 8, marginBottom: 4 }}>Link a bank account to deposit and withdraw in euros.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
        <Field label="IBAN" placeholder="RS35 2600 0560 1001 6113 79" />
        <Field label="Account holder" placeholder="Full name" />
        <Field label="Bank" placeholder="Select your bank" icon={Ico.chevD("rgba(255,255,255,0.4)", 17)} />
      </div>

      <div className="fl-warn" style={{ marginTop: 18, color: "#A9B0C2", background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
        {Ico.lock("#A78BFA", 18)}
        <span>Your banking details are encrypted and only used for transfers.</span>
      </div>
    </PhoneFrame>
  );
}
