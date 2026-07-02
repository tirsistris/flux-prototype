"use client";
// app/markets/page.tsx — Flux Markets (fl system), ported from screen-markets.jsx.
// Phase 4a: each market row now links to /coin/[id] (the parametrized coin detail)
// — this is the entry point that makes non-btc coin screens reachable. Phase 4b-2:
// Earn cards now link to /earn/[coin] (the stake detail flow); "See all" stays
// inert. Phase 4c: the searchbar links to /search (real live filtering); the two
// round buttons (copy/sliders — no corresponding flows in this phase) stay inert.
import React from "react";
import Link from "next/link";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { Segmented, CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, pct, chColor, type Earn } from "@/lib/flux-data";

function MarketRow({ id }: { id: string }) {
  const c = FLUX.coins[id];
  return (
    <Link href={`/coin/${id}`} className="fl-mkt-row" style={{ textDecoration: "none" }}>
      <CoinAvatar id={id} size={40} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 86 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{c.name}</span>
        <span style={{ fontSize: 12, color: "#8A91A3" }}>{c.supply}</span>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>{eur(c.price)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(c.ch) }}>{pct(c.ch)}</span>
      </div>
    </Link>
  );
}

function EarnCard({ e }: { e: Earn }) {
  const c = FLUX.coins[e.coin] || { name: e.name, sym: e.sym, id: e.coin };
  return (
    <Link href={`/earn/${e.coin}`} className="fl-card fl-earn-card" style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <CoinAvatar id={e.coin} size={28} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{c.sym}</span>
        <span className="fl-apy-tag">APY</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.4 }}>{pct(e.apy).replace("+", "")}</span>
      </div>
      <span style={{ fontSize: 12, color: "#8A91A3", marginTop: 2 }}>Earn on your {c.sym}</span>
    </Link>
  );
}

export default function MarketsPage() {
  const [tab, setTab] = React.useState("For you");
  const lists: Record<string, string[]> = {
    "For you": ["btc", "eth", "zec", "xrp", "sol"],
    Crypto: ["btc", "eth", "sol", "xrp", "uni"],
    Gainers: ["btc", "eth", "ltc", "xrp"],
    Hot: ["btc", "sol", "uni", "zec"],
  };
  return (
    <PhoneFrame active="markets">
      <div className="fl-mkt-top">
        <button className="fl-roundbtn">{Ico.copy("#fff", 19)}</button>
        <Link href="/search" className="fl-searchbar" style={{ textDecoration: "none" }}>{Ico.search("rgba(138,145,163,0.9)", 19)}<span>Search</span></Link>
        <button className="fl-roundbtn">{Ico.sliders("#fff", 19)}</button>
      </div>

      <div style={{ marginTop: 14 }}>
        <Segmented options={["For you", "Crypto", "Gainers", "Hot"]} value={tab} onChange={setTab} full={false} />
      </div>

      <div className="fl-mkt-list">
        {lists[tab].map((id) => (
          <MarketRow key={id} id={id} />
        ))}
      </div>

      <div className="fl-sec-head" style={{ marginTop: 4 }}>
        <span className="fl-sec-title">Earn</span>
        <span className="fl-sec-link">See all</span>
      </div>
      <div className="fl-earn-grid">
        {FLUX.earn.slice(0, 4).map((e, i) => (
          <EarnCard key={i} e={e} />
        ))}
      </div>
    </PhoneFrame>
  );
}
