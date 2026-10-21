// components/MarketRow.tsx — Figma "Coin row" in Markets / Search: coin, name,
// "TICKER · cap", price and 24h change. Bitcoin opens Buy 1 · Bitcoin; other coins
// have no screens in this prototype and open the quiet state.
import React from "react";
import Link from "next/link";
import { Num } from "@/components/Num";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { Coin } from "@/components/ui";
import { MARKETS, SEARCH_EXTRA, type Market, type MarketId } from "@/lib/legend";
import { eur, pct } from "@/lib/format";

export const ALL_COINS: Market[] = [...MARKETS, ...SEARCH_EXTRA];
export const coin = (id: MarketId) => ALL_COINS.find((m) => m.id === id) as Market;

export function MarketRow({ m }: { m: Market }) {
  return (
    <Link href={m.id === "BTC" ? "/buy" : NOT_IN_PROTOTYPE} className="list-row market-row">
      <Coin asset={m.id} size={40} />
      <span className="list-row-main">
        <span className="list-row-title">{m.name}</span>
        <span className="list-row-sub mono">
          <Num>{`${m.id} · ${m.cap}`}</Num>
        </span>
      </span>
      <span className="list-row-side">
        <span className="primary">
          <Num>{eur(m.priceCents)}</Num>
        </span>
        <span className={"secondary " + (m.up ? "gain" : "loss")}>
          <Num>{pct(m.change, m.up)}</Num>
        </span>
      </span>
    </Link>
  );
}
