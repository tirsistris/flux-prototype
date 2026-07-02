"use client";
// app/wallet/page.tsx — Flux Wallet (fl system), ported from screen-wallet.jsx.
// Phase 2b: the Transactions list reads store.transactions (NOT FLUX.txs directly)
// so a freshly-injected purchase surfaces at the top. Each row links to
// /tx/[id]. The AreaChart port already ships the 1H/1D/1W/1M/6M/1Y timeframe row.
// Receive/Send/Swap remain dead controls until their flows land (phase 3+).
import React from "react";
import Link from "next/link";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { AreaChart, CoinAvatar, BalAmt } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, pct, signEur, chColor, type Tx } from "@/lib/flux-data";
import { useBuy } from "@/lib/store";

// `href` makes the tile a navigable link (Send/Receive/Swap flows land in 4b-1).
function WalletAction({ icon, label, primary, href }: { icon: React.ReactNode; label: string; primary?: boolean; href?: string }) {
  const cls = "fl-action" + (primary ? " primary" : "");
  const inner = (
    <>
      <span className={"fl-action-ico" + (primary ? " primary" : "")}>{icon}</span>
      <span className="fl-action-label">{label}</span>
    </>
  );
  if (href) return <Link href={href} className={cls} style={{ textDecoration: "none" }}>{inner}</Link>;
  return <button className={cls}>{inner}</button>;
}

function TxRow({ tx }: { tx: Tx }) {
  return (
    <Link href={`/tx/${tx.id}`} className="fl-tx-row" style={{ textDecoration: "none" }}>
      <CoinAvatar id={tx.coin} size={38} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>{tx.name}</span>
        <span style={{ fontSize: 12, color: "#8A91A3" }}>{tx.date}</span>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: chColor(tx.amt) }}>{signEur(tx.amt)}</span>
        <span style={{ fontSize: 11.5, color: "#8A91A3" }}>{tx.ago}</span>
      </div>
    </Link>
  );
}

export default function WalletPage() {
  const { transactions } = useBuy();
  return (
    <PhoneFrame active="wallet">
      <div className="fl-wallet-head">
        <button className="fl-cur-sel">EUR {Ico.chevD("rgba(255,255,255,0.6)", 16)}</button>
        <span className="fl-wallet-title">Wallet Balance</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="fl-roundbtn sm">{Ico.chevD("rgba(255,255,255,0.7)", 16)}</button>
          <button className="fl-roundbtn sm">{Ico.dots("rgba(255,255,255,0.7)", 18)}</button>
        </div>
      </div>

      <div className="fl-balance center">
        <div className="fl-bal-label">Total balance</div>
        <div className="fl-bal-row">
          <BalAmt n={FLUX.balance} />
        </div>
        <div className="fl-bal-change" style={{ color: chColor(FLUX.dayPct) }}>
          {signEur(FLUX.dayAbs)} ({pct(FLUX.dayPct)})
        </div>
      </div>

      <div className="fl-actions" style={{ marginTop: 18 }}>
        <WalletAction icon={Ico.receive("rgba(255,255,255,0.92)", 22)} label="Receive" href="/receive" />
        <WalletAction icon={Ico.send("rgba(255,255,255,0.92)", 22)} label="Send" href="/send" />
        <WalletAction icon={Ico.swap("rgba(255,255,255,0.92)", 22)} label="Swap" href="/swap/confirm" />
      </div>

      <div style={{ marginTop: 20 }}>
        <AreaChart vals={FLUX.curve} w={342} h={132} label={eur(23565.23, 2)} id="wallet" />
      </div>

      <div className="fl-sec-head" style={{ marginTop: 16 }}>
        <span className="fl-sec-title">Transactions</span>
        <span className="fl-sec-link">See all</span>
      </div>
      <div className="fl-tx-list">
        {transactions.map((tx) => (
          <TxRow key={tx.id} tx={tx} />
        ))}
      </div>
    </PhoneFrame>
  );
}
