"use client";
// app/tx/[id]/page.tsx — Flux transaction detail, ported from screen-txdetail.jsx.
// Phase 2b: the source hardcoded a single TX object; here we RESOLVE the tx by id
// from store.transactions. A hard reload rebuilds the store from seeds only, so an
// injected id won't resolve — we show a clean "Transaction not found" state, never
// a crash or white 404. On-chain fields (from/to/hash) don't exist in this
// prototype: they're derived DETERMINISTICALLY from the tx id so each tx shows
// distinct-but-stable demo values. "View on explorer" is disabled (honest frame).
import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, fmtNum, fmtCrypto, GROWTH, type Tx, type TxType } from "@/lib/flux-data";
import { useBuy } from "@/lib/store";

const KIND: Record<TxType, { label: string; ico: (c?: string, w?: number) => React.ReactNode; sign: number }> = {
  buy: { label: "Bought", ico: Ico.receive, sign: 1 },
  received: { label: "Received", ico: Ico.receive, sign: 1 },
  sent: { label: "Sent", ico: Ico.send, sign: -1 },
  swap: { label: "Swapped", ico: Ico.swap, sign: 1 },
};

// Small deterministic hex generator: same id → same hash/addresses every render,
// different ids → different values. Purely presentational demo data.
function seedHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function hexFrom(s: string, len: number): string {
  let out = "";
  let n = seedHash(s);
  while (out.length < len) {
    n = (Math.imul(n ^ (n >>> 15), 2246822519) >>> 0) >>> 0;
    out += n.toString(16).padStart(8, "0");
  }
  return out.slice(0, len);
}
const addr = (id: string, salt: string) => `0x${hexFrom(id + salt, 3)}…${hexFrom(id + salt + "z", 3)}`;

function DetailRow({ label, value, mono, copy, last }: { label: string; value: string; mono?: boolean; copy?: boolean; last?: boolean }) {
  return (
    <div className={"fl-sum-row" + (last ? " total" : "")}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-tx-val" style={{ fontVariantNumeric: mono ? "tabular-nums" : "normal" }}>
        {value}
        {copy && <button className="fl-tx-copy">{Ico.copy("#8A79FF", 16)}</button>}
      </span>
    </div>
  );
}

function NotFound() {
  return (
    <PhoneFrame
      footer={
        <div className="fl-ctabar">
          <Link href="/wallet" className="fl-cta-sell" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            Back to Wallet
          </Link>
        </div>
      }
    >
      <div className="fl-flow-head">
        <Link href="/wallet" className="fl-roundbtn sm" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{Ico.chevL("#fff", 20)}</Link>
        <span className="fl-flow-title">Transaction</span>
        <div style={{ width: 34 }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "48px 24px", gap: 10 }}>
        <div className="fl-avatar" style={{ width: 56, height: 56 }}>{Ico.search("rgba(255,255,255,0.55)", 26)}</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Transaction not found</h2>
        <p style={{ fontSize: 13.5, color: "#8A91A3", maxWidth: 260, lineHeight: 1.5, margin: 0 }}>
          This is an in-memory demo — a page reload clears any purchases you made this session. Head back to your Wallet.
        </p>
      </div>
    </PhoneFrame>
  );
}

export default function TxDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { transactions } = useBuy();
  const tx: Tx | undefined = transactions.find((t) => t.id === params.id);

  if (!tx) return <NotFound />;

  const c = FLUX.coins[tx.coin];
  // Explicit type wins (injected buys carry type:'buy' → "Bought"); the amt sign
  // is only a fallback for seed rows that carry no explicit type.
  const kindKey: TxType = tx.type ?? (tx.amt >= 0 ? "received" : "sent");
  const k = KIND[kindKey];
  const amtCrypto = tx.cryptoAmount ?? Math.abs(tx.amt) / c.price;
  const eurVal = amtCrypto * c.price;
  const signed = k.sign >= 0 ? "+" : "-";
  const feeCrypto = tx.feeEur != null ? tx.feeEur / c.price : 0;

  const footer = (
    <div className="fl-ctabar">
      <Link href="/wallet" className="fl-cta-sell" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Done</Link>
    </div>
  );

  return (
    <PhoneFrame footer={footer} scroll>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Transaction</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-tx-top">
        <div className="fl-tx-kind-ico">
          {k.ico("#fff", 26)}
          <div className="fl-tx-coin-badge"><CoinAvatar id={tx.coin} size={26} /></div>
        </div>
        <div className="fl-tx-status">{Ico.check(GROWTH, 15)}<span>Completed</span></div>
        <div className="fl-tx-amt-wrap">
          <span className="fl-bal-amt" style={{ fontSize: 38 }}>{signed}{fmtCrypto(amtCrypto)}<span className="fl-bal-cur">{c.sym}</span></span>
          <span className="fl-tx-eur">≈ {eur(eurVal)}</span>
        </div>
      </div>

      <div className="fl-summary" style={{ marginTop: 8 }}>
        <DetailRow label="Type" value={k.label} />
        <DetailRow label="Date" value={tx.date} />
        <DetailRow label="From" value={addr(tx.id ?? tx.coin, "from")} mono />
        <DetailRow label="To" value={addr(tx.id ?? tx.coin, "to")} mono />
        <DetailRow label="Network" value={c.name} />
        {tx.feeEur != null && (
          <DetailRow label="Network fee" value={`${fmtNum(feeCrypto, 5)} ${c.sym} · ${eur(tx.feeEur)}`} />
        )}
        <DetailRow label="Transaction hash" value={`0x${hexFrom((tx.id ?? tx.coin) + "hash", 8)}…${hexFrom((tx.id ?? tx.coin) + "tail", 4)}`} mono copy last />
      </div>

      <button className="fl-explorer" disabled style={{ alignSelf: "flex-start", marginTop: 16, opacity: 0.45, cursor: "default" }}>
        View on explorer {Ico.external("#8A79FF", 16)}
      </button>
    </PhoneFrame>
  );
}
