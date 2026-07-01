// TabBar.tsx — Flux core (fl) bottom navigation, ported from ui.jsx.
// Phase 4a wires real navigation: every tab now has a screen (Home, Markets,
// Wallet, Trade, Profile), so each tab is a Link to its route. The active tab is
// highlighted via the `active` prop passed down from each page's PhoneFrame.
import React from "react";
import Link from "next/link";
import { Ico } from "@/components/icons";

const TABS = [
  { id: "home", label: "Home", href: "/home", ico: Ico.tabHome },
  { id: "markets", label: "Markets", href: "/markets", ico: Ico.tabMarkets },
  { id: "wallet", label: "Wallet", href: "/wallet", ico: Ico.tabWallet },
  { id: "trade", label: "Trade", href: "/trade", ico: Ico.tabTrade },
  { id: "profile", label: "Profile", href: "/profile", ico: Ico.tabProfile },
];

export function TabBar({ active }: { active?: string }) {
  return (
    <div className="fl-tabbar">
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <Link key={t.id} href={t.href} className="fl-tab" style={{ textDecoration: "none" }}>
            <div className={"fl-tab-ico" + (on ? " on" : "")}>
              {t.ico(on ? "#0A0D1A" : "rgba(255,255,255,0.5)", 23)}
            </div>
            <span style={{ color: on ? "#fff" : "rgba(255,255,255,0.4)" }}>{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
