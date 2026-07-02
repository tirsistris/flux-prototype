"use client";
// app/profile/page.tsx — Flux Profile (fl system), ported from screen-profile.jsx.
// Icon accents use the fx canon #8A79FF (the phase-3a TSX sweep replaced the export's
// #A78BFA). Honesty pass, phase 4a -> 4c:
//   • "Notifications" → Soon. This is the notification *setting* (screen not built);
//     it is NOT the notification feed — that feed is separate and lands on the Home
//     bell in phase 4c. Kept explicitly distinct so the two are never conflated.
//   • "Subscription" → Soon (premium, no screen).
//   • Phase 4c: "Personal data" / "Languages" / "Bank Accounts" now navigate to
//     their real settings screens. "Face ID" and "Safety" have no screens in this
//     phase — caught in the 4c audit as chevron-to-nowhere dead controls, moved
//     to "Soon" rather than left looking navigable.
//   • The "Account"/"Payments" section labels are plain text (never interactive).
//   • The header search/menu/edit buttons stay inert dead controls, consistent
//     with the rest of the prototype (icon-only controls, no text row implying
//     navigability the way a chevron row does).
//   • Log out → "/" (Welcome). AUTHORED: the source button was inert; returning to
//     Welcome is the honest, non-destructive logout behaviour for the prototype.
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { RoundBtn } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX } from "@/lib/flux-data";

const ICON = "#8A79FF";

function Row({ icon, label, last, soon, href }: { icon: React.ReactNode; label: string; last?: boolean; soon?: boolean; href?: string }) {
  const inner = (
    <>
      <span className="fl-set-ico">{icon}</span>
      <span className="fl-set-label">{label}</span>
      {soon ? (
        <span className="fl-soon-tag">Soon</span>
      ) : (
        <span style={{ marginLeft: "auto", display: "flex" }}>{Ico.chevR("rgba(255,255,255,0.35)", 18)}</span>
      )}
    </>
  );
  const cls = "fl-set-row" + (last ? " last" : "");
  if (href) return <Link href={href} className={cls} style={{ textDecoration: "none" }}>{inner}</Link>;
  return <div className={cls}>{inner}</div>;
}

export default function ProfilePage() {
  const router = useRouter();
  return (
    <PhoneFrame active="profile">
      <div className="fl-screenhead">
        <h1 className="fl-screentitle big">Profile</h1>
        <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <RoundBtn>{Ico.search("#fff", 20)}</RoundBtn>
          <RoundBtn>{Ico.menu("#fff", 20)}</RoundBtn>
        </div>
      </div>

      <div className="fl-card fl-profile-card">
        <div className="fl-avatar lg">{Ico.user("rgba(255,255,255,0.85)", 30)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{FLUX.user.name}</span>
          <span style={{ fontSize: 13, color: "#8A91A3" }}>{FLUX.user.email}</span>
        </div>
        <button className="fl-roundbtn sm" style={{ marginLeft: "auto" }}>{Ico.edit("#fff", 20)}</button>
      </div>

      <div className="fl-set-section-label">Account</div>
      <div className="fl-card fl-set-group">
        <Row icon={Ico.user(ICON, 20)} label="Personal data" href="/settings/kyc" />
        <Row icon={Ico.faceid(ICON, 20)} label="Face ID" soon />
        <Row icon={Ico.shield(ICON, 20)} label="Safety" soon />
        <Row icon={Ico.globe(ICON, 20)} label="Languages" href="/settings/languages" />
        {/* Notification SETTING (screen not built) — distinct from the Home-bell feed. */}
        <Row icon={Ico.bell(ICON, 20)} label="Notifications" soon last />
      </div>

      <div className="fl-set-section-label">Payments</div>
      <div className="fl-card fl-set-group">
        <Row icon={Ico.card(ICON, 20)} label="Bank Accounts" href="/settings/add-bank" />
        <Row icon={Ico.crown(ICON, 20)} label="Subscription" soon last />
      </div>

      <button className="fl-logout" onClick={() => router.push("/")}>{Ico.logout("#F87171", 20)}<span>Log out</span></button>
    </PhoneFrame>
  );
}
