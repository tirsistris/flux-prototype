// components/TabBar.tsx — Figma "Tab bar" 2292:926. The selected tab sits in a
// soft 56×32 capsule (tab/indicator); its glyph switches to the filled form.
import React from "react";
import Link from "next/link";
import { TabActivity, TabActivityOn, TabEarn, TabEarnOn, TabHome, TabHomeOn, TabMarkets, TabMarketsOn, TabProfile, TabProfileOn } from "@/components/icons";

export type TabId = "home" | "markets" | "earn" | "activity" | "profile";

const TABS: { id: TabId; label: string; href: string; off: React.FC; on: React.FC }[] = [
  { id: "home", label: "Home", href: "/home", off: TabHome, on: TabHomeOn },
  { id: "markets", label: "Markets", href: "/markets", off: TabMarkets, on: TabMarketsOn },
  { id: "earn", label: "Earn", href: "/earn", off: TabEarn, on: TabEarnOn },
  { id: "activity", label: "Activity", href: "/activity", off: TabActivity, on: TabActivityOn },
  { id: "profile", label: "Profile", href: "/profile", off: TabProfile, on: TabProfileOn },
];

export function TabBar({ active }: { active: TabId }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => {
        const on = t.id === active;
        const Glyph = on ? t.on : t.off;
        return (
          <Link key={t.id} href={t.href} className={"tab" + (on ? " on" : "")} aria-current={on ? "page" : undefined}>
            <span className="tab-indicator">
              <Glyph />
            </span>
            <span className="tab-label">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
