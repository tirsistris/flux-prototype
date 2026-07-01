"use client";
// app/home/page.tsx — Flux Home (fl system), ported from screen-home.jsx.
// Phase-1 pipeline check for the fl CSS + PhoneFrame + TabBar. Controls render
// live (balance eye toggle, Trending/Watchlist/… segmented) but do not yet
// navigate — routing/dead-control honesty lands in later phases.
import React from "react";
import Link from "next/link";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { ScreenHeader, RoundBtn, Segmented, Sparkline, CoinAvatar, BalAmt, ACCENT } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, pct, signEur, chColor } from "@/lib/flux-data";

function BalanceBlock() {
  const [hidden, setHidden] = React.useState(false);
  return (
    <div className="fl-balance">
      <div className="fl-bal-label">Total balance</div>
      <div className="fl-bal-row">
        <BalAmt n={FLUX.balance} hidden={hidden} />
        <button className="fl-eye" onClick={() => setHidden((h) => !h)}>
          {hidden ? Ico.eyeOff("rgba(255,255,255,0.55)", 21) : Ico.eye("rgba(255,255,255,0.55)", 21)}
        </button>
      </div>
      <div className="fl-bal-change" style={{ color: chColor(FLUX.dayPct) }}>
        {signEur(FLUX.dayAbs)} · {pct(FLUX.dayPct)} today
      </div>
    </div>
  );
}

function ActionTile({ icon, label, primary }: { icon: React.ReactNode; label: string; primary?: boolean }) {
  return (
    <button className={"fl-action" + (primary ? " primary" : "")}>
      <span className={"fl-action-ico" + (primary ? " primary" : "")}>{icon}</span>
      <span className="fl-action-label">{label}</span>
    </button>
  );
}

// `href` makes the card a navigable link (BTC → /coin/btc). Other tokens omit
// it and stay inert until coin/[id] parametrization lands in phase 4.
function TokenCard({ id, href }: { id: string; href?: string }) {
  const c = FLUX.coins[id];
  const inner = (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <CoinAvatar id={id} size={30} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{c.sym}</span>
          <span style={{ fontSize: 11.5, color: "rgba(138,145,163,0.9)" }}>{c.name}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.2 }}>{eur(c.price)}</span>
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(c.ch) }}>{pct(c.ch)}</span>
      <div style={{ marginTop: 6 }}>
        <Sparkline vals={c.spark} w={150} h={40} id={"tok" + id} up={c.ch >= 0} color={ACCENT.from} />
      </div>
    </>
  );
  const cls = "fl-card fl-token-card";
  if (href) {
    return (
      <Link href={href} className={cls} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}

function CoinRow({ id }: { id: string }) {
  const c = FLUX.coins[id];
  return (
    <div className="fl-coinrow">
      <CoinAvatar id={id} size={38} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{c.name}</span>
        <span style={{ fontSize: 12.5, color: "#8A91A3" }}>{c.sym}</span>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{eur(c.price)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(c.ch) }}>{pct(c.ch)}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [tab, setTab] = React.useState("Trending");
  const lists: Record<string, string[]> = {
    Trending: ["zec", "sol", "uni"],
    Watchlist: ["btc", "eth", "sol"],
    Gainers: ["btc", "eth", "ltc"],
    Losers: ["zec", "sol", "uni"],
  };
  return (
    <PhoneFrame active="home">
      <ScreenHeader
        left={
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div className="fl-avatar" style={{ width: 40, height: 40 }}>{Ico.user("rgba(255,255,255,0.85)", 22)}</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Hello {FLUX.user.first}</span>
          </div>
        }
        right={
          <>
            <RoundBtn>{Ico.search("rgba(255,255,255,0.8)", 20)}</RoundBtn>
            <RoundBtn>{Ico.menu("rgba(255,255,255,0.8)", 20)}</RoundBtn>
          </>
        }
      />

      <BalanceBlock />

      <div className="fl-actions">
        <ActionTile icon={Ico.receive("rgba(255,255,255,0.92)", 22)} label="Receive" />
        <ActionTile icon={Ico.send("rgba(255,255,255,0.92)", 22)} label="Send" />
        <ActionTile icon={Ico.swap("rgba(255,255,255,0.92)", 22)} label="Swap" />
      </div>

      <div className="fl-sec-head">
        <span className="fl-sec-title">Tokens</span>
        <span className="fl-sec-link">See all</span>
      </div>
      <div className="fl-token-grid">
        <TokenCard id="btc" href="/coin/btc" />
        <TokenCard id="eth" />
      </div>

      <div style={{ marginTop: 16 }}>
        <Segmented options={["Trending", "Watchlist", "Gainers", "Losers"]} value={tab} onChange={setTab} />
      </div>
      <div className="fl-coinlist">
        {lists[tab].map((id) => (
          <CoinRow key={id} id={id} />
        ))}
      </div>
    </PhoneFrame>
  );
}
