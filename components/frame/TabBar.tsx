// TabBar.tsx — Flux core (fl) bottom navigation, ported from ui.jsx.
// Phase 1 renders it statically (active tab highlighted); real navigation
// between tabs is wired in phase 3 when the other tab screens land.
import React from "react";
import { Ico } from "@/components/icons";

const TABS = [
  { id: "home", label: "Home", ico: Ico.tabHome },
  { id: "markets", label: "Markets", ico: Ico.tabMarkets },
  { id: "wallet", label: "Wallet", ico: Ico.tabWallet },
  { id: "trade", label: "Trade", ico: Ico.tabTrade },
  { id: "profile", label: "Profile", ico: Ico.tabProfile },
];

export function TabBar({ active }: { active?: string }) {
  return (
    <div className="fl-tabbar">
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <div key={t.id} className="fl-tab">
            <div className={"fl-tab-ico" + (on ? " on" : "")}>
              {t.ico(on ? "#0A0D1A" : "rgba(255,255,255,0.5)", 23)}
            </div>
            <span style={{ color: on ? "#fff" : "rgba(255,255,255,0.4)" }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
