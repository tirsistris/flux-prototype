"use client";
// app/earn/[id]/page.tsx — Earn / Stake detail, ported from stakeflow.jsx
// ScreenStakeDetail, parametrized by coin. APY comes from FLUX.earn[id].apy (real
// data), NOT the source file's hardcoded 4.20 — that constant only ever matched
// ETH, so /earn/btc or /earn/sol would have shown the wrong rate. The "How it
// works" step 2 copy embeds the same APY value for the same reason.
//
// The source "Your stake" card assumed a fabricated STAKED_ETH quantity that does
// not exist anywhere in FLUX — inventing a held amount would be dishonest (same
// rule the coin detail follows for its optional sections). Dropped. In its place:
// an "Earned so far" card using the real FLUX.earn[id].earned figure, which is
// already a EUR amount and needs no live price — this is what keeps /earn/usdc
// (no FLUX.coins entry, no price) from being empty below the fold.
//
// [Start earning] -> /earn/[id]/amount.
import React from "react";
import { useRouter, notFound } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum, GROWTH } from "@/lib/flux-data";

function StakeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="fl-stat2">
      <span className="fl-stat2-label">{label}</span>
      <span className="fl-stat2-val">{value}</span>
    </div>
  );
}

function HowRow({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="fl-how-row">
      <div className="fl-how-num">{n}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span className="fl-how-title">{title}</span>
        <span className="fl-how-body">{body}</span>
      </div>
    </div>
  );
}

export default function StakeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id.toLowerCase();
  const e = FLUX.earn.find((x) => x.coin === id);
  if (!e) return notFound();
  const c = FLUX.coins[id]; // undefined for usdc — no price modelled for it
  const sym = c?.sym ?? e.sym ?? id.toUpperCase();
  const name = c?.name ?? e.name ?? sym;

  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: "100%" }} onClick={() => router.push(`/earn/${id}/amount`)}>Start earning</button></div>
  );
  return (
    <PhoneFrame footer={footer} scroll>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Earn · {sym}</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-stake-hero">
        <CoinAvatar id={id} size={56} />
        <span className="fl-stake-apy"><span className="fl-bal-amt" style={{ fontSize: 44 }}>{fmtNum(e.apy, 2)}<span className="fl-bal-cur" style={{ color: GROWTH, fontSize: "0.5em" }}>% APY</span></span></span>
        <span className="fl-stake-hero-sub">Earn rewards on your {name}, paid automatically.</span>
      </div>

      <div className="fl-sec-head" style={{ marginTop: 8, marginBottom: 10 }}><span className="fl-sec-title">How it works</span></div>
      <div className="fl-card" style={{ padding: "6px 16px" }}>
        <HowRow n="1" title={`Lock your ${sym}`} body="Choose an amount and start earning right away." />
        <HowRow n="2" title="Earn every day" body={`Rewards build up automatically at ${fmtNum(e.apy, 2)} % a year.`} />
        <HowRow n="3" title="Withdraw anytime" body="Unstake whenever you like after the lock period." />
      </div>

      <div className="fl-stat2-grid" style={{ marginTop: 16 }}>
        <StakeStat label="Lock period" value="7 days" />
        <StakeStat label="Payouts" value="Daily" />
      </div>

      <div className="fl-sec-head" style={{ marginTop: 22, marginBottom: 10 }}><span className="fl-sec-title">Your rewards</span></div>
      <div className="fl-card fl-holding">
        <CoinAvatar id={id} size={42} />
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>Earned so far</span>
          <span style={{ fontSize: 12.5, color: "#8A91A3" }}>Paid automatically, daily</span>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: GROWTH }}>+{eur(e.earned)}</span>
          <span style={{ fontSize: 12, color: "#8A91A3" }}>total</span>
        </div>
      </div>
    </PhoneFrame>
  );
}
