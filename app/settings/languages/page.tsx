"use client";
// app/settings/languages/page.tsx — Languages, ported from settingsflow.jsx
// ScreenLanguages. Radio selection is genuinely live (local state) — the
// selection itself is the whole action, nothing to save/submit, so no CTA is
// needed (matches the source, which has none).
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Ico } from "@/components/icons";

const LANGS = [
  { name: "Русский", sub: "Russian" },
  { name: "English", sub: "English" },
  { name: "Deutsch", sub: "German" },
  { name: "Español", sub: "Spanish" },
  { name: "Français", sub: "French" },
  { name: "Türkçe", sub: "Turkish" },
];

export default function LanguagesPage() {
  const router = useRouter();
  const [sel, setSel] = React.useState("English");
  return (
    <PhoneFrame scroll footer={<div style={{ height: 12 }} />}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()} aria-label="Back">{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Languages</span>
        <div style={{ width: 34 }} />
      </div>
      <div className="fl-card fl-set-group" style={{ marginTop: 10 }}>
        {LANGS.map((l, i) => (
          <button key={l.name} className={"fl-lang-row" + (i === LANGS.length - 1 ? " last" : "")} onClick={() => setSel(l.name)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{l.name}</span>
              <span style={{ fontSize: 12.5, color: "#8A91A3" }}>{l.sub}</span>
            </div>
            <div className={"fl-radio" + (sel === l.name ? " on" : "")}>{sel === l.name && <div className="fl-radio-dot" />}</div>
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}
